import React, { useState } from "react";
import "./css/forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Forgot Password Function Executed", email);
  
    try {
      const response = await fetch("https://garb-rehab-backend.onrender.com/password-reset-request", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        // Handle non-200 HTTP responses
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (responseData.success) {
        alert("Password reset link has been sent to your email.");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      alert("An error occurred while requesting a password reset. Please try again later.");
    }
  };
  

  return (
    <div className="forgot-password">
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            value={email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
