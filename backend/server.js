const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
const Message = require('./models/Message');
const Group = require('./models/Group');
const User = require('./models/User'); 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

connectDB();
app.set('socketio', io);
app.use('/api', adminRoutes);

io.on("connection", (socket) => {

  socket.on("kickMember", async ({ groupId, userId }) => {
    console.log(`❌ Kicking user ${userId} from group ${groupId}`);

    try {
      // remove the user from the group's members array
      await Group.findByIdAndUpdate(groupId, { $pull: { members: userId } });

      // remove the group from the user's groups array
      await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

      console.log(`✅ Successfully removed user ${userId} from group ${groupId}`);

      // notify the kicked user only
      io.to(groupId).emit("userKicked", { groupId, userId });

      console.log(`📡 Emitting 'userKicked' event to user ${userId}`);

    } catch (error) {
      console.error("❌ Error kicking user from group:", error);
    }
  });


  socket.on("joinGroup", (groupId) => {
    // console.log(`👥 User ${socket.id} joined group ${groupId}`);
    socket.join(groupId);
  });

  socket.on("sendMessage", async (messageData) => {

    const { groupId, text, senderId } = messageData;
    if (!groupId || !text || !senderId) {
      console.error("🚨 Missing required message fields.");
      return;
    }

    try {
      let newMessage = new Message({
        groupId,
        text,
        sender: senderId,
        time: new Date(),
      });

      await newMessage.save();
      newMessage = await newMessage.populate("sender", "username");

      io.to(groupId).emit("receiveMessage", newMessage);

      io.to(groupId).emit("newMessageNotification", {
        groupId,
        text,
        sender: newMessage.sender.username,
      });

    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
