const express = require('express');
const {
  getFriends, removeFriend, sendFriendRequest, getFriendRequests,
  acceptFriendRequest, denyFriendRequest
} = require('../controllers/friendController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/fetch-friends', getFriends);
router.get('/requests', getFriendRequests);
router.post('/remove-friend', removeFriend);
router.post('/send-request', sendFriendRequest);
router.post('/accept-request', acceptFriendRequest);
router.post('/deny-request', denyFriendRequest);

module.exports = router;
