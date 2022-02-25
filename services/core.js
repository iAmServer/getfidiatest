const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const jwt = require("jsonwebtoken");

const option = {
  auth: {
    api_key: process.env.MAILGUN_PK,
  },
};

const client = nodemailer.createTransport(sgTransport(option));

const emailSender = (receiver, subject, token) => {
  const mailOptions = {
    from: process.env.MAILGUN_FROM,
    to: receiver,
    subject,
    html: `Get Fidia
    Please click on the link below to confirm your email address
    http://localhost:3000/account/${token}`,
    text: `Get Fidia
    Please click on the link below to confirm your email address
    http://localhost:3000/account/${token}`,
  };

  client.sendMail(mailOptions, function (error, response) {
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
