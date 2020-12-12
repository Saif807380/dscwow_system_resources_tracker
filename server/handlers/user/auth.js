import db from "../../models/index.js";
import jwt from "jsonwebtoken";

export const signin = async function (req, res, next) {
  try {
    const { password } = req.body.data;
    delete req.body.data.password;
    let user = await db.User.findOne(req.body.data);
    let { id, email, mobileNumber } = user;
    let isMatch = await user.comparePassword(password);
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          email,
          mobileNumber,
          role: "user",
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        user,
        token,
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password.",
      });
    }
  } catch (e) {
    return next({ status: 400, message: "Invalid Email/Password." });
  }
};

export const signup = async function (req, res, next) {
  try {
    let user = await db.User.create(req.body.data);
    let { id, email, mobileNumber } = user;
    let token = jwt.sign(
      {
        id,
        email,
        mobileNumber,
        role: "user",
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      err.message = "Sorry, that mobile Number and/or email is taken";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};
