import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Message from './Message';
import socket from '../socket'
import GroupOptionsModal from '../modals/GroupOptionsModal';
import '../css/chat.css';


const Chat = ({ groupId, groupName, groupDescription, onClose, userId, fetchGroups,setSelectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    setTimeout(scrollToBottom, 1);
  },[]);

  useEffect(() => {
    if (!groupId) return;
  
    axios.get(`http://localhost:3001/api/messages/${groupId}/messages`, { withCredentials: true })
      .then(response => {
        setMessages(response.data);
        setTimeout(scrollToBottom, 1);
      })
      .catch(error => console.error('Error fetching messages:', error));
      
      socket.off("userKicked");
      socket.on("userKicked", ({ groupId: kickedGroupId, userId: kickedUserId }) => {
      
        if (kickedUserId === userId && kickedGroupId === groupId) {
          alert(" you have been removed from the group");
          setSelectedGroup(null);
          fetchGroups();
        }
      });

      
    socket.emit('joinGroup', groupId);
  
    socket.off('receiveMessage');  
    socket.on('receiveMessage', (newMsg) => {
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setTimeout(scrollToBottom, 1);
    });
  
    return () => {
      socket.off("userKicked");
      socket.off('receiveMessage');
      socket.emit('leaveGroup', groupId);
    };
  }, [groupId]);
  
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const messageData = { groupId, text: newMessage, senderId: userId };
  
    console.log("🚀 Sending message:", messageData);
  
    socket.emit("sendMessage", messageData); 
  
    try {
      await axios.post(
        `http://localhost:3001/api/messages/${groupId}/messages`,
        messageData,
        { withCredentials: true }
      );

  
      setNewMessage('');
      setTimeout(scrollToBottom, 1);
    } catch (error) {
      console.error(" error sending message:", error);
    }
  };
  
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <div className="chat-container">
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

      <div className="chat-messages">
        {messages.map((msg) => (
          <Message
            key={msg._id}
            sender={msg.sender?.username || "Unknown"}
            text={msg.text}
            time={msg.time}
            isMe={msg.sender?._id === userId} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

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

      {isOptionsOpen && (
        <GroupOptionsModal
          groupId={groupId}
          groupName={groupName}
          onClose={() => setIsOptionsOpen(false)}
          userId={userId}
          fetchGroups={fetchGroups}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </div>
  );
};

export default Chat;
