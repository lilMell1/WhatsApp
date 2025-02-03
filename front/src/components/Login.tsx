import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/authService';
import '../css/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // ✅ Reset form data when isRegister changes
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    });
  }, [isRegister]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      if (isRegister) {
        await registerUser(formData);
      
        setIsRegister(!isRegister);
        alert('Registration successful! You can now log in.');
        setIsRegister(false);
      } else {
        const response = await loginUser({ username: formData.username, password: formData.password });
        
        alert('Login successful!');
        navigate('/app'); 
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </>
          )}
          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>
        <p 
          onClick={() => setIsRegister(prev => !prev)}
          className="toggle-form"
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Login;
