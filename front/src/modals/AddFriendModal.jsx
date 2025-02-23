import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Friend from '../components/Friend';
import '../css/addFriendModal.css';
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const AddFriendModal = ({ isOpen, onClose, userId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!userId || !isOpen) return;
  
    axios.get(`${SERVER_BASE_URL}/friends/fetch-friends`, { withCredentials: true }) 
      .then((response) => setFriends(response.data))
      .catch((error) => console.error('Error fetching friends:', error));
  }, [userId, isOpen]);
  

  const handleAddFriend = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a valid phone number.');
      return;
    }
  
    axios.post(`${SERVER_BASE_URL}/friends/send-request`, { userId, phoneNumber }, { withCredentials: true }) 
      .then((response) => {
        alert(response.data.message);
        setPhoneNumber('');
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Error adding friend.');
      });
  };
  
  const handleRemoveFriend = (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;

    axios.post(`${API_BASE_URL}/friends/remove-friend`, { userId, friendId }, { withCredentials: true })
      .then(() => {
        setFriends(friends.filter(friend => friend._id !== friendId)); // Remove from UI
      })
      .catch((error) => console.error('Error removing friend:', error));
  };

  if (!isOpen) return null; // Hide modal when closed

  return (
    <div className="addFriend-modal-overlay" onClick={onClose}>
      <div className="addFriend-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add a Friend</h2>

        {/* Input & Send Button */}
        <div className="addFriend-friend-input-container">
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button className="addFriend-btn-send-request" onClick={handleAddFriend}>Send</button>
        </div>

        {/* Friends List */}
        <h3>Your Friends</h3>
        <ul className="addFriend-friends-list">
          {friends.length === 0 ? <p>No friends added yet.</p> : (
            friends.map((friend) => (
              <Friend 
                key={friend._id} 
                username={friend.username} 
                phoneNumber={friend.phoneNumber} 
                onRemove={() => handleRemoveFriend(friend._id)}
              />
            ))
          )}
        </ul>

        <button className="addFriend-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddFriendModal;
