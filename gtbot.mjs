import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Load environment variables
const { TELEGRAM_TOKEN, EMAIL_ADDRESS, EMAIL_PASSWORD, GRAB_TALENT_EMAIL } = process.env;

function checkEnvVariables() {
    if (!TELEGRAM_TOKEN || !EMAIL_ADDRESS || !EMAIL_PASSWORD || !GRAB_TALENT_EMAIL) {
        console.error('Error: One or more environment variables are not set.');
        process.exit(1);
    }
}

checkEnvVariables();

// Create a bot that uses 'polling' to fetch new updates and enables promise cancellation
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true, cancellation: true });

// Set up nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
    },
});

const userSteps = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! 👋\n\nWelcome to Grab Talent! We are excited to help you create your account.\n\nTo get started, could you please provide your email address?');
    userSteps[chatId] = 'awaiting_email';
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (userSteps[chatId] === 'awaiting_email') {
        await handleEmailInput(chatId, msg.text);
    } else if (userSteps[chatId]?.step === 'awaiting_resume' && msg.document) {
        await handleResumeUpload(chatId, msg.document);
    } else if (!msg.document && userSteps[chatId]?.step === 'awaiting_resume') {
        bot.sendMessage(chatId, 'Please upload your resume (PDF, DOCX, etc.) so we can complete your account setup.');
    }
});

async function handleEmailInput(chatId, email) {
    userSteps[chatId] = { step: 'awaiting_resume', email };
    bot.sendMessage(chatId, `Thanks! We've got your email as ${email}.\n\nNow, please upload your resume (PDF, DOCX, etc.) so we can complete your account setup.`);
}

async function handleResumeUpload(chatId, document) {
    const userEmail = userSteps[chatId].email;
    const fileId = document.file_id;
    const fileName = document.file_name;
    const dest = path.join(process.cwd(), fileName);

    try {
        console.log(`Received document: ${fileName}`);
        await downloadFile(fileId, dest);
        console.log(`Downloaded file to: ${dest}`);

        // Ensure the file exists before proceeding
        await fs.access(dest);
        console.log(`File exists: ${dest}`);

        await sendEmailWithAttachment(userEmail, GRAB_TALENT_EMAIL, 'New Resume Received', 
            `We have received a new resume from ${userEmail}. Please find the attached file.`, fileName, dest);

        console.log('Email sent successfully.');

        await fs.unlink(dest);
        console.log('File deleted successfully.');

        await sendConfirmationEmail(userEmail);
        bot.sendMessage(chatId, 'Your resume has been successfully received and forwarded to our team at Grab Talent! 🎉\n\nYou should receive a confirmation email shortly. Thank you for using our service!');

        await logToFile(userEmail, fileName, 'Success');
        delete userSteps[chatId];
    } catch (error) {
        console.error('Error processing file:', error);
        bot.sendMessage(chatId, 'Oops! There was an error processing your file. Please try again.');
        await logToFile(userEmail, fileName, `Error: ${error.message}`);
    }
}

async function downloadFile(fileId, dest) {
    const fileLink = await bot.getFileLink(fileId);
    console.log(`File link: ${fileLink}`);
    
    const response = await fetch(fileLink);
    if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);

    const buffer = await response.buffer();
    await fs.writeFile(dest, buffer);
    console.log(`File downloaded to: ${dest}`);
}

async function sendEmailWithAttachment(from, to, subject, text, filename, filepath) {
    console.log(`Preparing to send email from ${from} to ${to} with subject "${subject}"`);

    const mailOptions = {
        from,
        to,
        subject,
        text,
        attachments: [{ filename, path: filepath }],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
        await logToFile(from, filename, `Error: ${error.message}`);
    }
}

async function sendConfirmationEmail(to) {
    const mailOptions = {
        from: EMAIL_ADDRESS,
        to,
        subject: 'Account Created on Grab Talent',
        text: 'Thank you for creating your account on Grab Talent. Your resume has been received and processed successfully. We will be in touch soon!',
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        await logToFile(EMAIL_ADDRESS, 'Confirmation Email', `Error: ${error.message}`);
    }
}

async function logToFile(email, fileName, status) {
    const logEntry = `${new Date().toISOString()} - Email: ${email}, File: ${fileName}, Status: ${status}\n`;
    await fs.appendFile('log.txt', logEntry);
    console.log('Log entry added:', logEntry);
}
