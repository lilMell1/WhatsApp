const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // ✅ Store friend requests
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
