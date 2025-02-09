const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }
});

module.exports = mongoose.model('Message', MessageSchema);
