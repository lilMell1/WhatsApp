import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/groupOptionsModal.css';

const GroupOptionsModal = ({ groupId, groupName, onClose, userId, onGroupUpdate }) => {
  const [members, setMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');

  useEffect(() => {
    if (!groupId) return;
    axios.get(`http://localhost:3001/api/groups/${groupId}/members`, { withCredentials: true })
      .then((response) => setMembers(response.data))
      .catch((error) => console.error('Error fetching members:', error));
  }, [groupId]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3001/api/users/friends`, { withCredentials: true })
      .then((response) => setFriends(response.data))
      .catch((error) => console.error('Error fetching friends:', error));
  }, [userId]);

  const handleInviteFriend = () => {
    if (!selectedFriend) {
      alert('Select a friend to invite.');
      return;
    }
    axios.post(`http://localhost:3001/api/groups/invite`, { groupId, friendId: selectedFriend }, { withCredentials: true })
      .then(() => {
        alert('Invitation sent!');
        setSelectedFriend('');
      })
      .catch((error) => console.error('Error sending invite:', error));
  };

  const handleLeaveGroup = () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
  
    axios.post(`http://localhost:3001/api/groups/leave`, { groupId }, { withCredentials: true })
      .then(() => {
        alert('You left the group');
        onGroupUpdate();  
        onClose(); 
      })
      .catch((error) => console.error('Error leaving group:', error));
  };
  
  const handleKickMember = (memberId) => {
    if (!window.confirm('Are you sure you want to kick this user?')) return;
  
    axios.post(`http://localhost:3001/api/groups/kick`, { groupId, userId: memberId }, { withCredentials: true })
      .then(() => {
        alert('User kicked successfully!');
        setMembers(members.filter(member => member._id !== memberId)); // ✅ Remove from UI
        onGroupUpdate();  
      })
      .catch((error) => console.error('Error kicking member:', error));
  };
  

  return (
    <div className="groupOptions-modal-overlay" onClick={onClose}>
      <div className="groupOptions-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Group Options - {groupName}</h2>

        <button className="groupOptions-btn-leave-group" onClick={handleLeaveGroup}>
          Leave Group
        </button>

        <div className="groupOptions-invite-container">
          <select value={selectedFriend} onChange={(e) => setSelectedFriend(e.target.value)}>
            <option value="">Select a Friend</option>
            {friends.map((friend) => (
              <option key={friend._id} value={friend._id}>
                {friend.username} ({friend.phoneNumber})
              </option>
            ))}
          </select>
          <button className="groupOptions-btn-send-invite" onClick={handleInviteFriend}>
            Send Invite
          </button>
        </div>

        {/* ✅ Scrollable Members List */}
        <div className="groupOptions-modal-body">
          <h3>Group Members</h3>
          <ul className="groupOptions-group-members-list">
            {members.map((member) => (
              <li key={member._id}>
                {member.username} ({member.phoneNumber})
                {member._id !== userId && (
                  <button className="groupOptions-btn-kick" onClick={() => handleKickMember(member._id)}>
                    Kick
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <button className="groupOptions-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GroupOptionsModal;
