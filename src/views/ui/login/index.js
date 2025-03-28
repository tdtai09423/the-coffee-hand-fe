import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaCoffee } from 'react-icons/fa';
import './login.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validUsername = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
    const validPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin';

    if (username === validUsername && password === validPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      // Redirect to the page user tried to visit or to starter page
      const from = location.state?.from?.pathname || '/starter';
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="welcome-text">
          <h1>Welcome to The Coffee Hand</h1>
          <p>Please sign in to continue</p>
        </div>

        <div className="login-box">
          <div className="text-center">
            <FaCoffee className="login-logo" />
            <h2>Admin Dashboard</h2>
          </div>
          
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 login-button"
            >
              Sign In
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;