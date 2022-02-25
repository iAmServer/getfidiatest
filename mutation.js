const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const lodash = require("lodash");

const CreatorModel = require("./models/creator");
const { emailSender } = require("./services/email");

const emailToken = (creator) => {
  const token = jwt.sign(
    {
      id: creator.id,
      email: creator.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

const Mutation = {
  async signup(_, { creator }) {
    const password = await bcrypt.hash(creator.password, 10);
    const newCreator = await CreatorModel.create({
      ...creator,
      password,
    });

    const token = emailToken(newCreator);
    emailSender(newCreator.email, "Confirm Email", token);

    return {
      token,
      creator: lodash.pick(newCreator, [
        "id",
        "name",
        "email",
        "phone",
        "country",
      ]),
    };
  },
  async confirmEmail(_, { token }) {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return {
              error: "Token expired",
            };
          }

          return {
            error: "Invalid token",
          };
        }

        const { id, email } = decoded;
        const creator = await CreatorModel.findOne({ id, email });

        if (creator && !creator.verified) {
          await CreatorModel.updateOne({ _id: id }, { verified: true });
          return {
            message: "Email confirmed successfully",
          };
        } else {
          return {
            message: "Email already confirmed",
          };
        }
      });
    } catch (err) {
      return {
        message: "Invalid token",
      };
    }
  },
  async resendEmailVerification(_, { token }) {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err && err.name === "TokenExpiredError") {
          decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            ignoreExpiration: true,
          });
        }

        const { id, email } = decoded;
        const creator = await CreatorModel.findOne({ id, email });

        if (creator && !creator.verified) {
          const token = emailToken(creator);

          emailSender(creator.email, "Confirm Email", token);
          return {
            message: "Email sent successfully",
          };
        } else {
          return {
            message: "Email already confirmed",
          };
        }
      });
    } catch (err) {
      return {
        message: "Invalid token",
      };
    }
  },
  async login(_, { email, password }) {
    const creator = await CreatorModel.findOne({ email });

    if (!creator) {
      return {
        error: "Invalid email or password",
      };
    }

    const isValid = await bcrypt.compare(password, creator.password);

    if (!isValid) {
      return {
        error: "Invalid email or password",
      };
    }

    const token = emailToken(creator);

    if (!creator.verified) {
      emailSender(creator.email, "Confirm Email", token);

      return {
        error: "User not verified, check your email",
      };
    }

    return {
      token,
      creator: lodash.pick(creator, [
        "id",
        "name",
        "email",
        "phone",
        "country",
      ]),
    };
  },
};

module.exports = Mutation;
