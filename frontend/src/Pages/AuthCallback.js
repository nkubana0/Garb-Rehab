import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    
    // Handle the authorization code, e.g., send it to your backend for token exchange
    if (code) {
      fetch('/api/auth/callback', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json())
        .then(data => {
          // Handle the response from your backend
          console.log(data);
        });
    }
  }, [location.search]);

  return <div>Processing...</div>;
};

export default AuthCallback;
