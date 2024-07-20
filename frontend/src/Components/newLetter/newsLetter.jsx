import React, { useState } from "react";
import "./news.css";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Successfully registered with email: ${email}`);
    setEmail("");
  };
  return (
    <div className="news-letter">
      <h1>Get Exclusive Offers on Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <form onSubmit={handleSubmit}>
        <input type="email" 
          placeholder='Your Email id' 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required />
        <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
