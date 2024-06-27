
# Grab Talent - Official Candidate Sign Up Telegram Bot

Welcome to Grab Talent's official Candidate Sign-Up Bot! This bot helps users seamlessly join our talent platform by guiding them through a simple registration process. Users provide their email, upload their resume, and become a part of the hiring revolution.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [Project Structure](#project-structure)

## Features

- **User Registration**: Guide users to provide their email address and upload their resume.
- **Admin Notifications**: Notify admins in a Telegram group when a new resume is submitted.
- **Logging**: Log user interactions and submission statistics for analysis and troubleshooting.

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
node main.mjs
```

## Project Structure

```
.
├── config
│   └── messageConfig.mjs
├── main.mjs
├── .env
├── package.json
└── README.md
```

- `config/messageConfig.mjs`: Contains the messages used by the bot.
- `main.mjs`: Main script to run the bot.
- `.env`: Environment variables configuration.
- `package.json`: Project dependencies and scripts.
- `README.md`: Project documentation.
