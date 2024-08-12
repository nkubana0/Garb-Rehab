import React, { useState, useEffect } from "react";
import "./css/verify.css";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("signup-email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      alert("Email not found. Please sign up again.");
      window.location.replace("/signup");
    }
  }, []);

  const handleVerify = async () => {
    try {
      const response = await fetch(
        "https://garb-rehab-backend.onrender.com/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const text = await response.text(); // Log raw response text
      console.log("Response text:", text);

      const responseData = JSON.parse(text); // Parse as JSON
      if (responseData.success) {
        alert("Email verified successfully!");
        window.location.replace("/login");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during verification. Please try again.");
    }
  };

  return (
    <div className="verify-email">
      <div className="container">
        <h2>Verify Your Email</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
};

export default VerifyEmail;
