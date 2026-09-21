const chatbotService = require("../services/chatbotService");

async function sendMessage(req, res, next) {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await chatbotService.processMessage(
      userId,
      message
    );

    res.status(200).json({
      response,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendMessage,
};