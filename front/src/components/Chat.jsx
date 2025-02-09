import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Message from './Message';
import GroupOptionsModal from '../modals/GroupOptionsModal';
import '../css/chat.css';

const socket = io('http://localhost:3001', { withCredentials: true });

const Chat = ({ groupId, groupName, groupDescription, onClose, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!userId) return;
    
    axios.get('http://localhost:3001/api/users/me', { withCredentials: true })
      .then(response => setUsername(response.data.username))
      .catch(error => console.error('Error fetching user:', error));
  }, [userId]);

  useEffect(() => {
    if (!groupId) return;

    // Fetch previous messages
    axios.get(`http://localhost:3001/api/messages/${groupId}/messages`, { withCredentials: true })
      .then((response) => setMessages(response.data))
      .catch((error) => console.error('Error fetching messages:', error));

    // Listen for incoming messages via Socket.io
    socket.emit('joinGroup', groupId);
    socket.on('receiveMessage', (newMsg) => {
      setMessages(prevMessages => [...prevMessages, newMsg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveGroup', groupId);
    };
  }, [groupId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = { groupId, text: newMessage, senderId: userId };

    // Emit message via Socket.io for real-time updates
    socket.emit('sendMessage', messageData);

    // Send message to backend
    axios.post(`http://localhost:3001/api/messages/${groupId}/messages`, messageData, { withCredentials: true })
      .then((response) => {
        setMessages(prevMessages => [...prevMessages, response.data]);
        setNewMessage('');
      })
      .catch((error) => console.error('Error sending message:', error));
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{groupName}</h2>
          <p className="chat-description">{groupDescription}</p>
        </div>
        <div className="chat-header-options">
          <button className="btn-option" onClick={() => setIsOptionsOpen(true)}>⋮</button>
          <button className="chat-close-btn" onClick={onClose}>X</button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? <p>No messages yet...</p> : (
          messages.map((msg) => (
            <Message key={msg._id} sender={msg.sender.username} text={msg.text} time={msg.time} />
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Group Options Modal */}
      {isOptionsOpen && (
        <GroupOptionsModal
          groupId={groupId}
          groupName={groupName}
          onClose={() => setIsOptionsOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Chat;
