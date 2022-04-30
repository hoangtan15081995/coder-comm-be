const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils");
const { checkObjectId } = require("./validator");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new AppError(401, "Token is Missing", "Login Require Error");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        throw new AppError(401, "Token Error", "Login Require Error");
      }
      checkObjectId(payload._id);
      req.currentUserId = payload._id; //undefiend
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
