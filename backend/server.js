const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
const Message = require('./models/Message');

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

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`👥 User joined group: ${groupId}`);
  });

  socket.on('sendMessage', async (messageData) => {
    console.log("📤 Receiving message:", messageData);

    const { groupId, text, senderId } = messageData;
    if (!groupId || !text || !senderId) {
      console.error("🚨 Missing required message fields.");
      return;
    }

    try {
      const newMessage = new Message({
        groupId,
        text,
        sender: senderId,
        time: new Date(),
      });

      await newMessage.save();
      console.log("✅ Message saved to DB:", newMessage);

      io.to(groupId).emit('receiveMessage', newMessage);
      console.log("📡 Message broadcasted to group:", groupId);
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
