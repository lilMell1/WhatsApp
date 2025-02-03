import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'; // For protected routes

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}> 
          <Route path="/app" element={<App />} /> 
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
