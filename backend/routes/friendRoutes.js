const express = require('express');
const { getFriends, removeFriend, sendFriendRequest, getFriendRequests, acceptFriendRequest, denyFriendRequest } = require('../controllers/friendController');

const router = express.Router();

router.get('/:userId/friends',getFriends);
router.get('/:userId/requests', getFriendRequests); 

router.post('/remove-friend',removeFriend);
router.post('/send-request', sendFriendRequest); 
router.post('/accept-request', acceptFriendRequest); 
router.post('/deny-request', denyFriendRequest);

module.exports = router;
