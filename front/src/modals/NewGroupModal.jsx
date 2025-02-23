import React, { useState } from 'react';
import '../css/newGroupModal.css'


const NewGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!groupName.trim()) {
      alert('Group name is required.');
      return;
    };
    if (groupName.length > 40){
      alert('group name must be 40 characters or less');
      return;
    }
    if (groupDescription.length > 120){
      alert('Description must be 120 characters or less');
      return;
    }

    const newGroup = {
      name: groupName,
      description: groupDescription,
      createDate: new Date().toISOString(), 
    };

    onCreate(newGroup); //  send data to Groups.jsx
    onClose(); // close the modal
  };

  if (!isOpen) return null; 

  return (
    <div className="addGroup-modal-overlay" onClick={onClose}> {/* close when clicking outside */}
      <div className="addGroup-modal-content" onClick={(e) => e.stopPropagation()}> {/* prevent closing when clicking inside */}
        <h2>Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <textarea
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <button type="submit" className='addGroup-create-btn'>Create</button>
          <button type="button" className="addGroup-close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default NewGroupModal;
