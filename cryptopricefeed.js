import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";

import dotenv from "dotenv";
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

async function getCryptoPrice(name) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`;
    const response = await fetch(url);
    const data = await response.json();
    return data[name] ? data[name].usd : 'Unknown';
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hello, I am CryptoPriceFeed Bot. Use /price <crypto_name> to get the price of a cryptocurrency');
});

bot.onText(/\/price(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const cryptoName = match[1] ? match[1].toLowerCase() : null;

    if (!cryptoName) {
        bot.sendMessage(chatId, "Please specify the cryptocurrency name. e.g., /price bitcoin");
        return;
    }

    const price = await getCryptoPrice(cryptoName);
    bot.sendMessage(chatId, `The current price of ${cryptoName} is $${price}`);
});
