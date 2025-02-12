import { useEffect, useState } from 'react';
import './App.css';
import Groups from './components/Groups';
import Chat from './components/Chat';
import Cookies from 'js-cookie';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [groups, setGroups] = useState([]); 

  const fetchGroups = () => {
    if (!userId) return;
    axios.get('http://localhost:3001/api/groups/my-groups', { withCredentials: true })
      .then(response => setGroups(response.data))
      .catch(error => console.error('Error fetching groups:', error));
  };

  useEffect(() => {
    if (userId) {
      fetchGroups();  // ✅ Only fetch groups after userId is set
    }
  }, [userId]);
  
  
  useEffect(() => {
    const token = Cookies.get('token'); 

    if (token) {
      axios.get('http://localhost:3001/api/auth/user', { withCredentials: true }) 
        .then((response) => {
          setUserId(response.data.userId);
          fetchGroups();
        })
        .catch((error) => {
          console.error(' Error fetching user:', error);
        });
    }
  }, []);

 

  return (
    <div className='app-container'>
        <Groups userId={userId} onSelectGroup={setSelectedGroup} groups={groups} fetchGroups={fetchGroups} /> 
        {selectedGroup ? (
          <Chat 
            userId={userId} 
            groupId={selectedGroup._id}
            groupName={selectedGroup.name}
            groupDescription={selectedGroup.description}
            onClose={() => {
              setSelectedGroup(null);
              fetchGroups(); 
            }}
            fetchGroups={fetchGroups}
          />
        ) : (
          <div className="chat-container">
            <div className="select-chat-message">
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
