import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/userSettingsModal.css"; 

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;


axios.get(`${SERVER_BASE_URL}/auth/user`, { withCredentials: true })
  .then(response => console.log(response.data))
  .catch(error => console.error("Error fetching user:", error));

const UserSettingsModal = ({ isOpen, onClose, userId }) => {
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isOpen) {
      setNewUsername(""); 
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteAccount = () => {
    axios
      .delete(`${SERVER_BASE_URL}/users`, {
        data: { userId }, 
        withCredentials: true
      })
      .then(() => {
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      });
  };

  const handleUpdateUsername = () => {
    axios
      .put(`${SERVER_BASE_URL}/users/update-name`, { userId, username: newUsername }, { withCredentials: true })
      .then(() => {
        alert("Username updated successfully!");
        setNewUsername("");
        onClose();
      })
      .catch((error) => {
        console.error("Error updating username:", error);
        alert("Failed to update username.");
      });
  };

  return (
    <div className="user-settings-modal-overlay" onClick={onClose}>
      <div className="user-settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>User Settings</h2>

        {/* Update Username Section */}
        <div className="user-settings-section">
          <label>New Username:</label>
          <input
            type="text"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button className="user-settings-btn-update" onClick={handleUpdateUsername}>
            Update Name
          </button>
        </div>

        <hr />

        {/* Delete Account Button */}
        <button className="user-settings-btn-danger" onClick={handleDeleteAccount}>
          Delete Account
        </button>

        {/* Close Button */}
        <button className="user-settings-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserSettingsModal;
