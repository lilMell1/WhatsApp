import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/groupOptionsModal.css';

const GroupOptionsModal = ({ groupId, groupName, onClose }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/groups/${groupId}/members`, { withCredentials: true })
      .then((response) => setMembers(response.data))
      .catch((error) => console.error('Error fetching members:', error));
  }, [groupId]);

  const handleDeleteGroup = () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      axios.delete(`http://localhost:3001/api/groups/${groupId}`, { withCredentials: true })
        .then(() => {
          alert('Group deleted successfully');
          onClose();
        })
        .catch((error) => console.error('Error deleting group:', error));
    }
  };

  const handleKickMember = (memberId) => {
    axios.post(`http://localhost:3001/api/groups/${groupId}/kick`, { userId: memberId }, { withCredentials: true })
      .then(() => {
        setMembers(members.filter(member => member._id !== memberId));
        alert('User removed from group');
      })
      .catch((error) => console.error('Error kicking user:', error));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Group Options - {groupName}</h2>
        <button className="btn-delete-group" onClick={handleDeleteGroup}>Delete Group</button>
        <button className="btn-add-user">Add Friend</button>
        <h3>Group Members</h3>
        <ul className="group-members-list">
          {members.map((member) => (
            <li key={member._id}>
              {member.username}
              <button className="btn-kick" onClick={() => handleKickMember(member._id)}>Kick</button>
            </li>
          ))}
        </ul>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GroupOptionsModal;
