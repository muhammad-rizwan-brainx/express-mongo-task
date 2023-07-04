const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AuthModel = require("../models/authModel");

const dotenv = require("dotenv");
dotenv.config();

const salt = process.env.SALT;

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(422).json({
          Message: "Mail Exists Already",
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            Error: err,
          });
        }
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          userName: req.body.userName,
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((result) => {
            res.status(201).json({
              Message: "User Created",
            });
          })
          .catch((err) => {
            res.status(500).json({
              Error: err,
            });
          });
      });
    });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          Message: "User Doesn't Exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, respons) => {
        if (err) {
          return res.status(401).json({
            Message: "Auth Fail",
          });
        }
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
          const userAuth = AuthModel.findOne({ email: req.body.email });
          console.log(userAuth);
          if (!userAuth) {
            const auth = new AuthModel({
              email: req.body.email,
              authToken: token,
            });
            auth
              .save()
              .then((result) => {
                res.status(201).json({
                  Message: "New User Token Added",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  Error: err,
                });
              });
          } else {
            AuthModel.updateOne(
              { email },
              { $set: { authToken: token } }
            )
              .exec()
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });
          }
          return res.status(200).json({
            message: "successfull",
            token: token,
          });
        }
        res.status(401).json({
          Message: "Auth Fail",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        Error: err,
      });
    });
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
