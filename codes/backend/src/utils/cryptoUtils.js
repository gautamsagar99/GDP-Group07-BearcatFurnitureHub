const CryptoJS = require("crypto-js");

const encryptionKey = "1234"; // Same key used for encryption in the frontend
const iv = "1234"; // Same IV used for encryption in the frontend

// Function to decrypt the email and password
function decryptData(encryptedData) {
  const ivBytes = CryptoJS.enc.Utf8.parse(iv);

  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey, {
    iv: ivBytes,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    decryptData,
  };