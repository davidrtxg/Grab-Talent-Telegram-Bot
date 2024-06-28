import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MESSAGES } from './config/messageConfig.mjs';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MESSAGE_CONFIG_PATH = path.resolve(__dirname, 'config', 'messageConfig.mjs');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Redirect root URL to /admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});

app.get('/admin', async (req, res) => {
    try {
        res.render('editMessages', { messages: MESSAGES });
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Error rendering admin page.');
    }
});

app.post('/admin', async (req, res) => {
    const updatedMessages = {};
    for (let key in req.body) {
        const value = req.body[key];
        updatedMessages[key] = value.includes('\n') ? value.split('\n') : value;
    }

    const newConfigContent = `export const MESSAGES = ${JSON.stringify(updatedMessages, null, 4)};`;
    try {
        await fs.writeFile(MESSAGE_CONFIG_PATH, newConfigContent);
        console.log('Message configuration updated successfully.');
        res.redirect('/admin');
    } catch (err) {
        console.error('Error saving message configuration:', err);
        res.status(500).send('Error saving message configuration.');
    }
});

app.listen(PORT, () => {
    console.log(`Admin dashboard is running on http://localhost:${PORT}`);
});
