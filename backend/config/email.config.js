// TODO: Set-up NodeMailer


// utils/sendMail.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, body) => {
  console.log("Recieved email data:", to, subject);
  
  const mailOptions = {
    from: `AI Assistant <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: body,
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      return info.messageId;
  } catch (error) {
    console.log("Error sending email:", error.message, error.name);
  }

};
