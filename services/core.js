const mailgun = require("mailgun-js");
const jwt = require("jsonwebtoken");

const mg = mailgun({
  apiKey: process.env.MAILGUN_PK,
  domain: process.env.MAILGUN_DOMIAN,
});

const emailSender = (receiver, subject, token) => {
  const data = {
    from: process.env.MAILGUN_FROM,
    to: receiver,
    subject,
    text: `Get Fidia
    Please click on the link below to confirm your email address
    http://localhost:3000/account/${token}`,
  };

  mg.messages().send(data, (error, body) => {
    return true;
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

// const sendConfirmationEmail = async (user) => {
//   transport
//     .sendMail({
//       from: "no-reply@doingiteasychannel.com",
//       to: `${user.name} <${user.email}>`,
//       subject: "Confirmation Email",
//       html: `Confirmation Email <a href=${url}> ${url}</a>`,
//     })
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch(() => {
//       console.log("Emails was not sent");
//     });
// };

module.exports = { emailSender, emailToken };
