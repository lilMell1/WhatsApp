const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  groupInvites: [{
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, 
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  }]
});

module.exports = mongoose.model('User', UserSchema);
