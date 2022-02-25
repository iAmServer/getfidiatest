const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const jwt = require("jsonwebtoken");

const mailgunAuth = {
  auth: {
    apiKey: process.env.MAILGUN_PK,
    domain: process.env.MAILGUN_DOMIAN,
  },
};
const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

const emailSender = (receiver, subject, token) => {
  const mailOptions = {
    from: process.env.MAILGUN_FROM,
    to: receiver,
    subject,
    html: `Get Fidia
    Please click on the link below to confirm your email address
    http://localhost:3000/account/${token}`,
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Successfully sent email.");
    }
  });
};

const emailToken = (creator) => {
  const token = jwt.sign(
    {
      id: creator.id,
      email: creator.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: 60 }
  );

  return token;
};

module.exports = { emailSender, emailToken };
