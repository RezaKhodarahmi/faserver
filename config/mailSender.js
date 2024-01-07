const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.fanavaran.ca",
  port: 465,
  secure: true,
  auth: {
    user: "test@fanavaran.ca",
    pass: "qR~9eK8eUKM",
  },
});

module.exports = { transporter };
