import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Group from './Group';
import GroupModal from '../modals/NewGroupModal';
import AddFriendModal from '../modals/AddFriendModal';
import BellModal from '../modals/BellModal';
import '../css/groups.css';
import '../css/group.css';


const Groups = ({ userId, onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false); // ✅ Track AddFriendModal state
  const [isBellModalOpen, setIsBellModalOpen] = useState(false);
  useEffect(() => {
    if (!userId) return;

    axios.get('http://localhost:3001/api/groups/my-groups', { withCredentials: true })
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error('Error fetching groups:', error);
      });
  }, [userId]);

  const createGroup = (newGroup) => {
    if (!userId) {
      alert('User not authenticated');
      return;
    }

    axios.post('http://localhost:3001/api/groups/create', newGroup, { withCredentials: true })
      .then((response) => {
        setGroups([...groups, response.data]); 
      })
      .catch((error) => {
        console.error('Error creating group:', error);
      });
  };

  return (
    <div className="groups-container">
      <div className='groups-container-header'>
        <strong>Chats</strong>
        <div className='float-left'>
          <button className='btn-add-group' onClick={() => setIsGroupModalOpen(true)}>New Group</button>
          <button className="btn-bell">
              <svg viewBox="0 0 448 512" width="100%" height="100%" className="bell" onClick={() => setIsBellModalOpen(true)}><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
          </button>  
          <button className='btn-add-friend' onClick={() => setIsFriendModalOpen(true)}>Add Friend</button>  
        </div>
      </div>

      <div className='groups-div'>
        {groups.length === 0 ? <p>No groups found.</p> : (
          groups.map((group) => (
            <Group 
              key={group._id} 
              name={group.name} 
              description={group.description} 
              date={group.createDate} 
              onOpenChat={() => onSelectGroup(group)} 
            />
          ))
        )}
      </div>

      {/* group Modal */}
      <GroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        onCreate={createGroup} 
      />

      {/* add Friend Modal */}
      <AddFriendModal 
        isOpen={isFriendModalOpen} 
        onClose={() => setIsFriendModalOpen(false)} 
        userId={userId}
      />

      <BellModal
        isOpen={isBellModalOpen}
        onClose={() => setIsBellModalOpen(false)}
        userId={userId}
      />
    </div>
  );
};

export default Groups;
