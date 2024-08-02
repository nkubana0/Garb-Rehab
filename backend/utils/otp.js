const crypto = require("crypto");

const generateOtp = () => {
  return crypto.randomBytes(3).toString("hex"); // Generate a 6-character OTP
};

module.exports = { generateOtp };
