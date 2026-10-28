const axios = require("axios");

const sendToTelegram = async (text) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: process.env.TELEGRAM_CHANNEL_ID,
    text: `🤫 CONFESSION:\n\n${text}`,
  });
};

module.exports = { sendToTelegram };
