
# Grab Talent Telegram Bot - Technical Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Bot Features](#bot-features)
5. [Admin Dashboard Features](#admin-dashboard-features)
6. [Running the Project](#running-the-project)
7. [Configuration](#configuration)
8. [Code Explanation](#code-explanation)
   1. [Main Bot (`main.mjs`)](#main-bot-mainmjs)
   2. [Admin Dashboard (`admin.js`)](#admin-dashboard-adminjs)
   3. [Message Configuration (`messageConfig.mjs`)](#message-configuration-messageconfigmjs)
   4. [Views](#views)
   5. [Public Assets](#public-assets)
9. [Error Handling](#error-handling)
10. [Logging](#logging)
11. [Future Improvements](#future-improvements)

## Introduction

This project implements a Telegram bot for Grab Talent, allowing users to sign up as candidates by providing their email and uploading their resume. The bot notifies admins in a Telegram group when a new resume is submitted and logs user interactions for analysis and troubleshooting. Additionally, an admin dashboard is provided for updating the message configurations used by the bot.

## Project Structure

```
.
├── config
│   └── messageConfig.mjs
├── public
│   └── styles.css
├── views
│   ├── editMessages.ejs
│   └── layout.ejs
├── main.mjs
├── admin.js
├── .env
├── package.json
└── README.md
```

## Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (14+)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TXG-Ryan/Grab-Talent-Telegram-Bot.git
   cd Grab-Talent-Telegram-Bot
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Bot Features

- Guides users through providing their email address and uploading their resume.
- Notifies admins in a Telegram group when a new resume is submitted.
- Logs user interactions and submission statistics for analysis and troubleshooting.

## Admin Dashboard Features

- Provides a web interface for admins to update the message configurations used by the bot.

## Running the Project

### Running the Bot

To start the bot, run the following command:

```bash
npm run start
```

### Running the Admin Dashboard

To start the admin dashboard, run the following command:

```bash
npm run admin
```

### Running Both Simultaneously

To run both the bot and the admin dashboard simultaneously, use the following command:

```bash
npm run dev
```

Then, open your browser and navigate to `http://localhost:3000/admin` to access the admin dashboard.

## Configuration

Create a `.env` file in the root of the project and add the following environment variables:

```
TELEGRAM_TOKEN=your_telegram_bot_token
EMAIL_ADDRESS=your_email_address
EMAIL_PASSWORD=your_email_password
GRAB_TALENT_EMAIL=grab_talent_email_address
ADMIN_GROUP_CHAT_ID=your_admin_group_chat_id
```

## Code Explanation

### Main Bot (`main.mjs`)

The main bot script handles the core functionalities of the bot, including user interactions, resume submissions, and logging.

### Admin Dashboard (`admin.js`)

The admin dashboard script sets up a web server using Express.js, allowing admins to update the message configurations via a web interface.

### Message Configuration (`messageConfig.mjs`)

This file contains the messages used by the bot. It exports an object with different message templates.

```javascript
export const MESSAGES = {
    welcome: [
        'Hello and welcome to Grab Talent! 👋',
        'We're thrilled to have you here. Let's get you started on your journey to exciting career opportunities. Please provide your email address to create your account.'
    ],
    emailPrompt: [
        'Thank you! We've received your email: {email}. ✅',
        'Next, please upload your resume (PDF, DOCX, etc.) to complete your account setup. We're excited to learn more about you!'
    ],
    invalidEmail: 'Oops! The email address you provided seems to be invalid. 🚫 Please double-check and try again. We want to ensure we can reach you!',
    invalidFile: 'The file you uploaded is not a valid resume format or exceeds the size limit. Please upload a PDF or DOCX file not larger than 2MB.',
    uploadResume: 'Great! Now, please upload your resume (PDF, DOCX, etc.) to complete your account setup. 📄 We're eager to see your qualifications and help you find the best opportunities!',
    success: [
        'Your resume has been successfully received and forwarded to our team at Grab Talent! 🎉',
        'Thank you for using our service. We're excited to help you on your career journey!'
    ],
    error: 'Oops! Something went wrong while processing your file. 😔 Please try uploading your resume again. If the issue persists, contact our support team for assistance.',
    emailUsed: 'It looks like the email address you provided has already been used. 🔄 Please use a different email address to continue. We're here to help if you need any assistance!',
};
```

### Views

The views are EJS templates used by the admin dashboard.

#### `views/layout.ejs`

The layout template that wraps around other views.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Admin Dashboard</h1>
        </header>
        <main>
            <%- body %>
        </main>
    </div>
</body>
</html>
```

#### `views/editMessages.ejs`

The template for editing message configurations.

```html
<h2>Edit Message Configurations</h2>

<form action="/admin" method="post">
    <% for (let key in messages) { %>
        <div class="form-group">
            <label for="<%= key %>"><%= key %></label>
            <textarea id="<%= key %>" name="<%= key %>" rows="4"><%= Array.isArray(messages[key]) ? messages[key].join('
') : messages[key] %></textarea>
        </div>
    <% } %>
    <button type="submit">Save Changes</button>
</form>
```

### Public Assets

#### `public/styles.css`

CSS styles for the admin dashboard.

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
}

.container {
    width: 80%;
    margin: 0 auto;
}

header {
    background: #333;
    color: #fff;
    padding: 10px 0;
    text-align: center;
}

form {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background: #555;
}
```

## Error Handling

- The bot handles various error scenarios, such as invalid email format, invalid file type, and file size exceeding the limit.
- Errors encountered during file download, email sending, and logging are caught and logged appropriately.

## Logging

- Logs user interactions and submission statistics for analysis and troubleshooting.
- Uses a JSON file to store logs, capturing details such as email address, file name, submission status, and admin notification status.

## Future Improvements

- Add user authentication for the admin dashboard.
- Enhance the logging mechanism to include more detailed analytics.
- Implement automated tests for the bot and the admin dashboard.
