const express = require('express');
const authRoutes = require('./authRoutes');
const groupRoutes = require('./groupRoutes');
const friendRoutes = require('./friendRoutes');
const messageRoutes = require('./messageRoutes'); 

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/groups', groupRoutes);
router.use('/users', friendRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
