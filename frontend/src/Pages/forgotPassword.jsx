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
    let responseData;
    await fetch("https://garb-rehab-backend.onrender.com/password-reset-request", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      alert("Password reset link has been sent to your email.");
    } else {
      alert(responseData.errors);
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
