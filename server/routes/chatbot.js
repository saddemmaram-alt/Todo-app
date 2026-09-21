const express = require("express");

const {
  sendMessage,
} = require("../controllers/chatbotController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Protect chatbot routes with JWT authentication
router.use(authMiddleware);

router.post(
  "/",
  sendMessage
);

module.exports = router;