import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { MESSAGES } from './config/messageConfig.mjs';

const { TELEGRAM_TOKEN, EMAIL_ADDRESS, EMAIL_PASSWORD, GRAB_TALENT_EMAIL, ADMIN_GROUP_CHAT_ID } = process.env;
const LOG_FILE_PATH = 'email_usage_log.json';
const userSteps = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_ADDRESS, pass: EMAIL_PASSWORD }
});

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true, cancellation: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userSteps[chatId] = { step: 'awaiting_email' };
    sendMessagesWithDelay(chatId, MESSAGES.welcome);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') return;

    const currentStep = userSteps[chatId]?.step;

    if (currentStep === 'awaiting_email') {
        if (validateEmail(text)) {
            await handleEmailInput(chatId, text);
        } else {
            bot.sendMessage(chatId, MESSAGES.invalidEmail);
        }
    } else if (currentStep === 'awaiting_resume') {
        if (msg.document) {
            await handleResumeUpload(chatId, msg.document);
        } else {
            bot.sendMessage(chatId, MESSAGES.uploadResume);
        }
    } else {
        bot.sendMessage(chatId, MESSAGES.invalidEmail);
    }
});

async function handleEmailInput(chatId, email) {
    if (await checkEmailUsed(email)) {
        bot.sendMessage(chatId, MESSAGES.emailUsed);
    } else {
        userSteps[chatId] = { step: 'awaiting_resume', email };
        sendMessagesWithDelay(chatId, MESSAGES.emailPrompt.map(msg => msg.replace('{email}', email)));
        await logEmail(chatId, email, 'In Progress');
    }
}

async function handleResumeUpload(chatId, document) {
    if (!validateFile(document)) {
        bot.sendMessage(chatId, MESSAGES.invalidFile);
        return;
    }

    const { email } = userSteps[chatId];
    const filePath = path.join(process.cwd(), document.file_name);

    try {
        await downloadFile(document.file_id, filePath);
        await sendEmailWithAttachment(email, GRAB_TALENT_EMAIL, 'New Resume Received', `We have received a new resume from ${email}. Please find the attached file.`, filePath);
        await fs.unlink(filePath);

        sendMessagesWithDelay(chatId, MESSAGES.success);
        await notifyAdmin(email, document.file_name);

        await updateLogEntry(email, document.file_name, 'Success', { notifiedAdmins: 'Admin notified' });
        delete userSteps[chatId];
    } catch (error) {
        await handleError(chatId, email, document.file_name, error);
    }
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validateFile(document) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    return allowedTypes.includes(document.mime_type) && document.file_size <= maxSize;
}

async function downloadFile(fileId, dest) {
    const response = await fetch(await bot.getFileLink(fileId));
    if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
    await fs.writeFile(dest, await response.buffer());
}

async function sendEmailWithAttachment(from, to, subject, text, filepath) {
    await transporter.sendMail({
        from,
        to,
        subject,
        text,
        attachments: [{ filename: path.basename(filepath), path: filepath }]
    });
}

async function notifyAdmin(email, fileName) {
    try {
        await bot.sendMessage(
            ADMIN_GROUP_CHAT_ID, 
            `*New Registration* \n\n*Email:* ${email} \n*File:* ${fileName} \n*Via:* Telegram`, 
            { parse_mode: 'Markdown' }
        );
    } catch (error) {
        await updateLogEntry(email, fileName, 'Success', { notifiedAdmins: `Admin notification failed: ${error.message}` });
    }
}

async function checkEmailUsed(email) {
    try {
        const logs = JSON.parse(await fs.readFile(LOG_FILE_PATH, 'utf-8'));
        return logs.some(log => log.email === email);
    } catch (err) {
        if (err.code === 'ENOENT') return false;
        return false;
    }
}

async function logEmail(chatId, email, status) {
    const logEntry = { timestamp: new Date().toISOString(), chatId, email, status };
    try {
        const logs = await readLogs();
        logs.push(logEntry);
        await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error('Error writing email log:', err);
    }
}

async function updateLogEntry(email, fileName, status, additionalLogs = {}) {
    try {
        const logs = await readLogs();
        const logEntry = logs.find(log => log.email === email);
        if (logEntry) {
            Object.assign(logEntry, { fileName, status, ...additionalLogs });
        } else {
            logs.push({ email, fileName, status, ...additionalLogs });
        }
        await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error('Error updating log entry:', err);
    }
}

async function readLogs() {
    try {
        return JSON.parse(await fs.readFile(LOG_FILE_PATH, 'utf-8')) || [];
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function handleError(chatId, email, fileName, error) {
    console.error('Error processing file:', error);
    await updateLogEntry(email, fileName, 'Error', { error: error.message });
    bot.sendMessage(chatId, MESSAGES.error);
}

function sendMessagesWithDelay(chatId, messages, delay = 1000) {
    messages.forEach((msg, index) => {
        setTimeout(() => bot.sendMessage(chatId, msg), index * delay);
    });
}
