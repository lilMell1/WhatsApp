const Message = require('../models/Message');
const Group = require('../models/Group');


exports.sendMessage = async (req, res) => {
  try {
    const { groupId, text } = req.body;
    const senderId = req.user.id; 

    if (!groupId || !text) {
      return res.status(400).json({ message: "Group ID and text are required." });
    }

    const newMessage = new Message({
      groupId,
      text,
      sender: senderId,
      time: new Date(),
    });

    await newMessage.save();

    await newMessage.populate('sender', 'username');

    const io = req.app.get('socketio'); 
    io.to(groupId).emit('newMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: "Error sending message", error });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ groupId }).populate('sender', 'username');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
