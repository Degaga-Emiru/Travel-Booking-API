const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', chatController.getConversations);
router.get('/:receiverId', chatController.getMessages);
router.post('/', chatController.sendMessage);

module.exports = router;
