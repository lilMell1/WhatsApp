const express = require('express');
const { createGroup, getUserGroups } = require('../controllers/groupController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/create', createGroup);
router.get('/my-groups', getUserGroups);

module.exports = router;
