import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData, {
    withCredentials: true, 
    headers: { 'Content-Type': 'application/json' }
  });
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true, 
    headers: { 'Content-Type': 'application/json' }
  });
};

export const logoutUser = async () => {
  return await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};
