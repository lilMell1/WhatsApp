import { useEffect, useState } from 'react';
import './App.css';
import Groups from './components/Groups';
import Chat from './components/Chat';
import Cookies from 'js-cookie';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); 

  useEffect(() => {
    const token = Cookies.get('token'); 

    if (token) {
      axios.get('http://localhost:3001/api/auth/user', { withCredentials: true }) 
        .then((response) => {
          setUserId(response.data.userId);
        })
        .catch((error) => {
          console.error(' Error fetching user:', error);
        });
    }
  }, []);

  return (
    <div className='app-container'>
        <Groups userId={userId} onSelectGroup={setSelectedGroup} /> 
        {selectedGroup ? (
          <Chat 
            userId={userId} 
            groupId={selectedGroup._id}
            groupName={selectedGroup.name}
            groupDescription={selectedGroup.description}
            onClose={() => setSelectedGroup(null)}
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
