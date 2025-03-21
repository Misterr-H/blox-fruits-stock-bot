# Blox Fruits Stock Discord Bot

A Discord bot that tracks and displays Blox Fruits stock information, including both normal and mirage stock.

## Setup

1. Create a new Discord application and bot at https://discord.com/developers/applications
2. Copy your bot token and add it to the `.env` file as `DISCORD_TOKEN`
3. Add your channel ID to the `.env` file as `CHANNEL_ID`
4. Install dependencies: `npm install`
5. Deploy commands: `node src/deploy-commands.js`
6. Start the bot: `npm run dev`

## Features

- Automatically updates stock information every 5 minutes
- Displays both normal and mirage stock
- Supports `/stock` command for manual checks
- Clean embed messages with timestamps
- Automatic cleanup of old messages

## Commands

- `/stock` - Get the current Blox Fruits stock information

## Note

You'll need to implement the actual API endpoint for fetching Blox Fruits stock data. The current code uses a placeholder URL.