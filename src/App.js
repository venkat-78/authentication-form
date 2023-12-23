import React, { useState, useEffect } from 'react';
import './App.css';
const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const apiUrl = 'https://dummyjson.com/auth/login';

  const login = () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Successful login
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      })
      .catch((error) => {
        // Display error message
        setError('Invalid email or password');
      });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      fetchUserProfile(storedUser.id);
    }
  }, []);

  const fetchUserProfile = (userId) => {
    fetch(`https://dummyjson.com/users/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((userData) => {
        localStorage.setItem('userDetails', JSON.stringify(userData));
      })
      .catch((error) => console.error('Error fetching user details:', error));
  };

  const displayUserInfo = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      return (
        <div>
          <h1>Profile</h1>
          <p>
            <strong>ID:</strong> {userDetails.id}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          {/* Add more user details as needed */}
        </div>
      );
    }
    return null;
  };

  const handleResetPassword = () => {
    setShowResetModal(!showResetModal);
  };

  const handlePasswordReset = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      storedUser.password = newPassword;
      localStorage.setItem('user', JSON.stringify(storedUser));
      setShowResetModal(false);
      setNewPassword('');
    }
  };

  return (
    <div>
      {user ? (
        displayUserInfo()
      ) : (
        <div>
          <h4>Welcome back!<span>&#128075;</span></h4>
          <h1>Sign in to your account</h1>
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={login}>Login</button>
          <button onClick={handleResetPassword}>Forgot Password</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {showResetModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleResetPassword}>
              &times;
            </span>
            <h2>Reset Password</h2>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={handlePasswordReset}>Reset Password</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;