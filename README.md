
# Grab Talent - Official Candidate Sign Up Telegram Bot

Welcome to Grab Talent's official Candidate Sign-Up Bot! This bot helps users seamlessly join our talent platform by guiding them through a simple registration process. Users provide their email, upload their resume, and become a part of the hiring revolution.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [Running the Admin Dashboard](#running-the-admin-dashboard)
- [Project Structure](#project-structure)

## Features

- **User Registration**: Guides users through providing their email address and uploading their resume.
- **Admin Notifications**: Notifies admins in a Telegram group when a new resume is submitted.
- **Admin Dashboard**: Provides a web interface for admins to update the message configurations used by the bot.
- **Logging**: Logs user interactions and submission statistics for analysis and troubleshooting.

## Getting Started

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

## Configuration

Create a `.env` file in the root of the project and add the following environment variables:

```
TELEGRAM_TOKEN=your_telegram_bot_token
EMAIL_ADDRESS=your_email_address
EMAIL_PASSWORD=your_email_password
GRAB_TALENT_EMAIL=grab_talent_email_address
ADMIN_GROUP_CHAT_ID=your_admin_group_chat_id
```

## Running the Bot

To start the bot, run the following command:

```bash
npm run start
```

## Running the Admin Dashboard

To start the admin dashboard, run the following command:

```bash
npm run admin
```

To run both the bot and the admin dashboard simultaneously, use the following command:

```bash
npm run dev
```

Then, open your browser and navigate to `http://localhost:3000/admin` to access the admin dashboard.

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

- `config/messageConfig.mjs`: Contains the messages used by the bot.
- `public/styles.css`: Styles for the admin dashboard.
- `views/editMessages.ejs`: EJS template for editing messages.
- `views/layout.ejs`: EJS template for the layout.
- `main.mjs`: Main script to run the bot.
- `admin.js`: Script to run the admin dashboard.
- `.env`: Environment variables configuration.
- `package.json`: Project dependencies and scripts.
- `README.md`: Project documentation.
