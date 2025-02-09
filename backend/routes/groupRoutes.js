const express = require('express');
const {
  createGroup, getUserGroups, getGroupMembers, leaveGroup, deleteGroup,
  inviteFriend, kickMember, acceptGroupInvite, declineGroupInvite, getGroupInvites
} = require('../controllers/groupController'); 

const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/create', createGroup);
router.get('/my-groups', getUserGroups);
router.get('/:groupId/members', getGroupMembers);
router.post('/leave', leaveGroup);
router.delete('/:groupId', deleteGroup);
router.post('/invite', inviteFriend);
router.post('/kick', kickMember);
router.post('/accept-invite', acceptGroupInvite);
router.post('/decline-invite', declineGroupInvite);
router.get('/group-invites', getGroupInvites);

module.exports = router;
