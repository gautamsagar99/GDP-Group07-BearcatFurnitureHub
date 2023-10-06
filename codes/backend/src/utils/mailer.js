// src/utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Set to true if using port 465 (SSL/TLS)
  auth: {
    user: "gautamsagar72@gmail.com", // Your Outlook email address
    pass: process.env.EMAIL_PASSWORD, // Your Outlook email password or app password
  },
});

function sendResetToken(email, resetToken) {
  // Configure the email options
  const mailOptions = {
    from: "gautamsagar72@gmail.com", // Sender email address
    // to: "s555619@nwmissouri.edu", // Recipient email address
    to: email,
    subject: "Password Reset", // Email subject
    text: `Your password reset token: ${resetToken} and This code expires by today 12 PM`, // Email content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function sendRequestFurnitureMail(requestedEmail, donaterEmail, productName) {
  // Configure the email options
  const mailOptions = {
    from: "gautamsagar72@gmail.com", // Sender email address
    // to: "s555619@nwmissouri.edu", // Recipient email address
    to: [requestedEmail, donaterEmail],
    subject: "Furniture Requested Sucessfully", // Email subject
    text: `Product : ${productName} has been requested successfully.`, // Email content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function sendCancelFurnitureMail(requestedEmail, donaterEmail, productName) {
  // Configure the email options
  const mailOptions = {
    from: "gautamsagar72@gmail.com", // Sender email address
    // to: "s555619@nwmissouri.edu", // Recipient email address
    to: [requestedEmail, donaterEmail],
    subject: "Furniture Cancelled Sucessfully", // Email subject
    text: `Product : ${productName} has been cancelled successfully.`, // Email content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function sendDeleteFurnitureMail(email, productName) {
  // Configure the email options
  const mailOptions = {
    from: "gautamsagar72@gmail.com", // Sender email address
    // to: "s555619@nwmissouri.edu", // Recipient email address
    to: email,
    subject: "Furniture Deleted Sucessfully", // Email subject
    text: `Product : ${productName} has been Deleted successfully.`, // Email content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function sendSucessfulFurnitureMail(requestedEmail, donaterEmail, productName) {
  // Configure the email options
  const mailOptions = {
    from: "gautamsagar72@gmail.com", // Sender email address
    // to: "s555619@nwmissouri.edu", // Recipient email address
    to: [requestedEmail, donaterEmail],
    subject: "Delivered Successfully", // Email subject
    text: `Product : ${productName} has been Delivered Successfully.`, // Email content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = {
  sendResetToken,
  sendRequestFurnitureMail,
  sendCancelFurnitureMail,
  sendDeleteFurnitureMail,
  sendSucessfulFurnitureMail,
};
