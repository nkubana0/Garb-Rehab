import React, { useState } from "react";
import "./css/forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Track the current step

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        alert("OTP has been sent to your email.");
        setStep(2); // Move to the OTP verification step
      } else {
        setError(responseData.errors || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setError("An error occurred while requesting a password reset. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch("https://garb-rehab-backend.onrender.com/verify-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }), // Send email and OTP for verification
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        alert("OTP verified successfully. Please enter your new password.");
        setStep(3); // Move to the password reset step
      } else {
        setError(responseData.errors || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("An error occurred while verifying the OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch("https://garb-rehab-backend.onrender.com/reset-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }), // Send email, OTP, and new password
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        alert("Password has been reset successfully.");
        window.location.replace("/login");
      } else {
        setError(responseData.errors || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("An error occurred while resetting the password. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-1">
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>

        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Enter new password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
