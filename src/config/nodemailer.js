const nodemailer = require("nodemailer");

class Nodemailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendNodeMailer(otp, email) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Password reset OTP",
      text: `Berikut adalah kode OTP untuk reset password: ${otp}`,
    };

    this.transporter.sendMail(mailOptions);
  }
}

module.exports = new Nodemailer();
