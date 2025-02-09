const express = require('express');
const { getUserInfo } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// ✅ Route to get current user info
router.get('/me', getUserInfo);

module.exports = router;
