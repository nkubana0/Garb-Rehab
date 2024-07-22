import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication logic for demonstration
    if (username === 'admin' && password === 'password') {
      onLogin();
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className='login'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type='text' 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
