import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import '../css/chat.css';

const Chat = ({ groupId, groupName, groupDescription, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!groupId) return;

    axios.get(`http://localhost:3001/api/groups/${groupId}/messages`, { withCredentials: true })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  }, [groupId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    axios.post(`http://localhost:3001/api/groups/${groupId}/messages`, { text: newMessage }, { withCredentials: true })
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
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
          <button className="btn-option">Options</button>
          <div className="chat-options-menu">
            <p>{groupDescription}</p>
            <button className="btn-delete">Delete Group</button>
            <button className="btn-add-user">Add User</button>
          </div>
          <button className="chat-close-btn" onClick={onClose}>X</button>

        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? <p>No messages yet...</p> : (
          messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} text={msg.text} time={msg.time} />
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
    </div>
  );
};

export default Chat;
