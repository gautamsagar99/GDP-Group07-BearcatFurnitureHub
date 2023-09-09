const CryptoJS = require("crypto-js");

// Same IV used for encryption in the frontend

// Function to decrypt the email and password
function decryptData(encryptedData) {
  const encryptionKey = process.env.ENCRYPTION_KEY; // Same key used for encryption in the frontend
  const iv = process.env.ENCRYPTION_IV;

  const ivBytes = CryptoJS.enc.Utf8.parse(iv);

  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey, {
    iv: ivBytes,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  decryptData,
};
