import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/bellModal.css';

const BellModal = ({ isOpen, onClose, userId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!userId || !isOpen) return;

    axios.get(`http://localhost:3001/api/users/${userId}/requests`, { withCredentials: true })
      .then(response => setRequests(response.data))
      .catch(error => console.error('Error fetching requests:', error));
  }, [userId, isOpen]);

  const handleAccept = (requestId) => {
    axios.post('http://localhost:3001/api/users/accept-request', { userId, requestId }, { withCredentials: true })
      .then(() => setRequests(requests.filter(req => req._id !== requestId)))
      .catch(error => console.error('Error accepting request:', error));
  };

  const handleDeny = (requestId) => {
    axios.post('http://localhost:3001/api/users/deny-request', { userId, requestId }, { withCredentials: true })
      .then(() => setRequests(requests.filter(req => req._id !== requestId)))
      .catch(error => console.error('Error denying request:', error));
  };

  if (!isOpen) return null;

  return (
    <div className="bell-modal-overlay" onClick={onClose}>
      <div className="bell-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Friend Requests</h2>
        {requests.length === 0 ? <p>No pending requests.</p> : (
          requests.map((req) => (
            <div key={req._id} className="request-item">
              <div className="bell-request-info">
                <p className="bell-request-name">{req.username}</p>
                <p className="bell-request-phone">{req.phoneNumber}</p>
              </div>
              <p className="bell-request-type">Friend Request</p>
              <div className="bell-request-buttons">
                <button className="bell-btn-accept" onClick={() => handleAccept(req._id)}>Accept</button>
                <button className="bell-btn-deny" onClick={() => handleDeny(req._id)}>Deny</button>
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
