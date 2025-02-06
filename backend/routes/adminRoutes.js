const express = require('express');
const authRoutes = require('./authRoutes'); 
const groupRoutes = require('./groupRoutes');
const friendRoutes = require('./friendRoutes'); 

const router = express.Router();

router.use('/auth', authRoutes); 
router.use('/groups', groupRoutes);
router.use('/users', friendRoutes); 

module.exports = router;
