import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/bellModal.css';

const BellModal = ({ isOpen, onClose, userId }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [groupInvites, setGroupInvites] = useState([]);

  useEffect(() => {
    if (!userId || !isOpen) return;

    axios.get(`http://localhost:3001/api/users/requests`, { withCredentials: true })
      .then(response => {
        setFriendRequests(response.data);
        console.log("🟢 Friend Requests:", response.data);
      })
      .catch(error => console.error('Error fetching friend requests:', error));

    axios.get(`http://localhost:3001/api/groups/group-invites`, { withCredentials: true })
      .then(response => {
        setGroupInvites(response.data);
        console.log("🟢 Group Invites:", response.data);
      })
      .catch(error => console.error('Error fetching group invites:', error));
  }, [userId, isOpen]);

  const handleAcceptFriend = (friendId) => {
    axios.post('http://localhost:3001/api/users/accept-request', { friendId }, { withCredentials: true })
      .then(() => setFriendRequests(friendRequests.filter(req => req._id !== friendId)))
      .catch(error => console.error('Error accepting friend request:', error));
  };

  const handleDenyFriend = (friendId) => {
    axios.post('http://localhost:3001/api/users/deny-request', { friendId }, { withCredentials: true })
      .then(() => setFriendRequests(friendRequests.filter(req => req._id !== friendId)))
      .catch(error => console.error('Error denying friend request:', error));
  };

  const handleAcceptGroup = (groupId) => {
    axios.post('http://localhost:3001/api/groups/accept-invite', { groupId }, { withCredentials: true })
      .then(() => setGroupInvites(groupInvites.filter(invite => invite.groupId._id !== groupId)))
      .catch(error => console.error('Error accepting group invite:', error));
  };

  const handleDenyGroup = (groupId) => {
    axios.post('http://localhost:3001/api/groups/decline-invite', { groupId }, { withCredentials: true })
      .then(() => setGroupInvites(groupInvites.filter(invite => invite.groupId._id !== groupId)))
      .catch(error => console.error('Error denying group invite:', error));
  };

  if (!isOpen) return null;

  return (
    <div className="bell-modal-overlay" onClick={onClose}>
      <div className="bell-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Notifications</h2>

        {/* Friend Requests */}
        <h3>Friend Requests</h3>
        {friendRequests.length === 0 ? <p>No pending friend requests.</p> : (
          friendRequests.map((req) => (
            <div key={req._id} className="bell-request-item">
              <div className="bell-request-info">
                <p className="bell-request-name">{req.username}</p>
                <p className="bell-request-phone">{req.phoneNumber}</p>
              </div>
              <p className="bell-request-type">Friend Request</p>
              <div className="bell-request-buttons">
                <button className="bell-btn-accept" onClick={() => handleAcceptFriend(req._id)}>Accept</button>
                <button className="bell-btn-deny" onClick={() => handleDenyFriend(req._id)}>Deny</button>
              </div>
            </div>
          ))
        )}

        {/* Group Invites */}
        <h3>Group Invites</h3>
        {groupInvites.length === 0 ? <p>No group invites.</p> : (
          groupInvites.map((invite) => (
            <div key={invite._id} className="bell-request-item">
              <div className="bell-request-info">
                <p className="bell-request-name">{invite.groupId.name}</p>
                <p className="bell-request-phone">Invited by: {invite.invitedBy.username}</p>
              </div>
              <p className="bell-request-type">Group Invitation</p>
              <div className="bell-request-buttons">
                <button className="bell-btn-accept" onClick={() => handleAcceptGroup(invite.groupId._id)}>Accept</button>
                <button className="bell-btn-deny" onClick={() => handleDenyGroup(invite.groupId._id)}>Deny</button>
              </div>
            </div>
          ))
        )}

        <button className="bell-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BellModal;
