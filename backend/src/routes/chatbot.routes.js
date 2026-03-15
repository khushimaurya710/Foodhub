const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');

// GET /api/chatbot/token - returns a signed Chatbase identity token for the current user
router.get('/token', authUserMiddleware, chatbotController.getChatbotToken);

module.exports = router;

