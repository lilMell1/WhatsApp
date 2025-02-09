const express = require('express');
const { getMessages, sendMessage } = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/:groupId/messages', getMessages);

router.post('/send', sendMessage);

module.exports = router;
