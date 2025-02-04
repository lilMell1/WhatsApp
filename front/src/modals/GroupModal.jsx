import React, { useState } from 'react';
import '../css/groupModal.css'

const GroupModal = ({ isOpen, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ Prevent default form submission behavior

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
      createDate: new Date().toISOString(), // ✅ Automatically add createDate
    };

    onCreate(newGroup); // ✅ Send data to `Groups.jsx`
    onClose(); // ✅ Close the modal
  };

  if (!isOpen) return null; // ✅ Hide modal when `isOpen` is false

  return (
    <div className="modal-overlay" onClick={onClose}> {/* ✅ Close when clicking outside */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* ✅ Prevent closing when clicking inside */}
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
          <button type="submit" className='create-btn'>Create</button>
          <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
