import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { EMAIL_ACCOUNT, EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_PASSWORD,
  },
});

export const sendEmail = (email, body) => {
    let message = {
      to: email,
      from: "DSCWOW",
      subject: "Email Notification",
      text:
        "You are receiving this because you (or someone else) have requested Email Notification.\n\n" +
        body
        +"\n\n" +
        "If you did not request this, please ignore this email.\n",
    };
    return transporter.sendMail(message);
};