const express = require('express');
const authRoutes = require('./authRoutes'); 
const groupRoutes = require('./groupRoutes');

const router = express.Router();

router.use('/auth', authRoutes); 
router.use('/groups', groupRoutes);

module.exports = router;
