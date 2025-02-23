const express = require('express');
const authRoutes = require('./authRoutes');
const groupRoutes = require('./groupRoutes');
const friendRoutes = require('./friendRoutes');
const messageRoutes = require('./messageRoutes'); 
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/groups', groupRoutes);
router.use('/friends', friendRoutes);
router.use('/messages', messageRoutes);
router.use('/users', userRoutes);

module.exports = router;
