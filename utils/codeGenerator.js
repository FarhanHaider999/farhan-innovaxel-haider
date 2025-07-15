const crypto = require("crypto");

// For Generating shortCode
const generateShortCode = (length = 6) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    result += chars[randomIndex];
  }
  return result;
};

module.exports = {
  generateShortCode,
};

