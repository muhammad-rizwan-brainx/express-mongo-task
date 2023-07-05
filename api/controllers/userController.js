const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AuthModel = require("../models/authModel");
const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config();

const salt = process.env.SALT;

const signupSchema = Joi.object({
  userName: Joi.string().required().messages({
    "any.required": "User Name is required",
    "string.empty": "User Name is required",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

exports.signup = async (req, res, next) => {
  try {
    await signupSchema.validateAsync(req.body, { abortEarly: false });

    const existingUser = await User.findOne({ email: req.body.email }).exec();
    if (existingUser) {
      return res.status(422).json({
        Message: "Mail Exists Already",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      Message: "User Created",
    });
  } catch (err) {
    const errors = err.details.map((error) => error.message);
    res.status(422).json({ errors });
  }
};

exports.login = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });

    const email = req.body.email;
    const user = await User.find({ email: req.body.email }).exec();
    if (user.length < 1) {
      return res.status(401).json({
        Message: "User Doesn't Exist",
      });
    }
    const respons = await bcrypt.compare(req.body.password, user[0].password);
    if (respons) {
      const token = jwt.sign(
        {
          email: user[0].email,
          id: user[0]._id,
        },
        salt,
        {
          expiresIn: "1h",
        }
      );
      const userAuth = await AuthModel.findOne({ email: req.body.email });
      console.log(userAuth);
      if (!userAuth) {
        const auth = new AuthModel({
          email: req.body.email,
          authToken: token,
        });
        await auth.save();
        res.status(201).json({
          Message: "New User Token Added",
        });
      } else {
        await AuthModel.updateOne(
          { email },
          { $set: { authToken: token } }
        ).exec();
        console.log(result);
      }
      return res.status(200).json({
        message: "successful",
        token: token,
      });
    }
    res.status(401).json({
      Message: "Auth Fail",
    });
  } catch (err) {
    res.status(422).json({
      Error: err.details[0].message,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to process change password request" });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = jwt.sign({ userId: user._id }, salt, {
      expiresIn: "1h",
    });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    console.log(resetToken);
    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to process forgot password request" });
  }
};
