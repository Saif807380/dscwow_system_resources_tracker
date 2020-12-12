import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const loginRequired = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded) {
        req.body.decoded = decoded;
        next();
      } else {
        return next({ status: 401, message: "Please Log In First" });
      }
    });
  } catch (e) {
    return next({ status: 401, message: "Please Log In First" });
  }
};

export const ensureCorrectUser = function (req, res, next) {
  try {
    if (req.body.decoded && req.body.decoded.id === req.params.id) {
      return next();
    } else {
      return next({ status: 402, message: "Unauthorized!" });
    }
  } catch (e) {
    return next({ status: 402, message: "Unauthorized" });
  }
};
