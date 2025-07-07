const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Your OTP for Note App",
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  });
};

module.exports = sendEmail;
