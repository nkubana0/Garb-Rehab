import React, { useState } from "react";

const VerifyOTPAndResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    let responseData;
    await fetch("https://garb-rehab-backend.onrender.com/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      alert("Password has been reset successfully.");
      window.location.replace("/login");
    } else {
      alert(responseData.errors);
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
