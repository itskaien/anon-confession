const axios = require("axios");

const sendToTelegram = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  if (!token || !chatId) {
    throw new Error(
      "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in .env",
    );
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: `🤫 CONFESSION:\n\n${text}`,
    });
  } catch (error) {
    console.error(
      "Telegram API Error Details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

module.exports = { sendToTelegram };
