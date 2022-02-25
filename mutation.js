const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const lodash = require("lodash");

const CreatorModel = require("./models/creator");
const { emailSender, emailToken } = require("./services/core");

const tokenAuth = async (creator) => {
  if (creator) {
    if (!creator.verified) {
      await CreatorModel.updateOne({ _id: id }, { verified: true });
      return {
        success: true,
        message: "Email confirmed successfully",
      };
    } else {
      return {
        success: true,
        message: "Email already confirmed",
      };
    }
  } else {
    return {
      success: false,
      error: "User not found",
    };
  }
};

const Mutation = {
  async signup(_, { creator }) {
    try {
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
    } catch (err) {
      if (err.name === "ValidationError") {
        return {
          error: "Email is assigned to another creator",
        };
      }
    }
  },
  async confirmEmail(_, { token }) {
    try {
      const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { id, email } = payload;
      const creator = await CreatorModel.findOne({ _id: id, email });

      return await tokenAuth(creator);
    } catch (err) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return {
            success: false,
            error: "Token expired",
            message: "Request for a new token",
          };
        }

        return {
          success: false,
          error: "Invalid token",
          message: "Request for a new token",
        };
      }
    }
  },
  async resendEmailVerification(_, { token }) {
    try {
      const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { id, email } = payload;
      const creator = await CreatorModel.findOne({ _id: id, email });

      return await tokenAuth(creator);
    } catch (err) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY, {
            ignoreExpiration: true,
          });
          const { id, email } = payload;
          const creator = await CreatorModel.findOne({ _id: id, email });
          const newToken = emailToken(creator);

          if (!creator.verified) {
            emailSender(newCreator.email, "Confirm Email", newToken);
            return {
              success: true,
              message: "New verification email sent",
            };
          } else {
            return {
              success: true,
              message: "Creator Verified",
            };
          }
        }

        return {
          success: false,
          error: "Invalid token",
          message: "Request for a new token",
        };
      }
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
