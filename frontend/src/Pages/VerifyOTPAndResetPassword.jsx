import React, { useState } from "react";

const VerifyOTPAndResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    try {
      const response = await fetch("https://garb-rehab-backend.onrender.com/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        alert("Password has been reset successfully.");
        window.location.replace("/login");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("An error occurred while resetting the password. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Enter OTP and New Password</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
};

export default VerifyOTPAndResetPassword;
