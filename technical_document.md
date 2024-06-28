
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

The `main.mjs` file handles the core functionalities of the bot, including:

- Initializing the bot using the `node-telegram-bot-api` library and loading environment variables using `dotenv`.
- Validating email addresses and uploaded files.
- Handling user email input, validating it, and logging the interaction.
- Handling resume upload, validating the file, sending the resume via email, and logging the interaction.
- Utility functions for file download, sending emails, logging, and error handling.

### Admin Dashboard (`admin.js`)

The `admin.js` file sets up a web server using Express.js, allowing admins to update the message configurations via a web interface. It handles:

- Initializing the Express server and middleware.
- Rendering the admin page with the current message configurations.
- Saving the updated message configurations to the configuration file.

### Message Configuration (`messageConfig.mjs`)

The `messageConfig.mjs` file contains the messages used by the bot. It exports an object with different message templates for various stages of user interaction, such as welcome messages, email prompts, invalid email/file notifications, resume upload instructions, success messages, and error messages.

### Views

The views are EJS templates used by the admin dashboard.

- `layout.ejs`: The layout template that wraps around other views.
- `editMessages.ejs`: The template for editing message configurations.

### Public Assets

The `public/styles.css` file contains CSS styles for the admin dashboard, including styles for the body, container, header, form, form-group, labels, textareas, and buttons.

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
