const mongoose = require("mongoose");
const User = require("../models/userModel");
const hashPassword = require("../utils/hashPassword");

const checkExistingUser = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((result) => resolve(result))
      .catch((err) => reject("Failed to check existing user."));
  });
};

const createUser = (userData) => {
  return new Promise(async (resolve, reject) => {
    const { userName, email, password } = userData;

    const hashedPassword = await hashPassword.hashPassword(password);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName,
      email,
      password: hashedPassword,
    });

    user
      .save()
      .then((result) => resolve(result))
      .catch((err) => reject("Failed to create user."));
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((result) => resolve(result))
      .then((err) => reject("Failed to find user by email."));
  });
};

const updatePassword = (user, newPassword) => {
  return new Promise((resolve, reject) => {
    user.password = newPassword;
    user.resetToken = null;

    user
      .save()
      .then((result = resolve(result)))
      .catch((err) => reject("Failed to update user password."));
  });
};

const findUserByResetToken = (resetPasswordToken) => {
  return new Promise((resolve, reject) => {
    User.findOne({ resetPasswordToken })
      .then((result = resolve(result)))
      .catch((err) => reject("Failed to find user by reset token."));
  });
};

const updateResetToken = (user, resetToken, expiration) => {
  return new Promise((resolve, reject) => {
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiration;

    user
      .save()
      .then((result) => resolve(result))
      .catch((err) =>
        reject("Failed to update user reset password token and expiration.")
      );
  });
};

module.exports = {
  updateResetToken,
  checkExistingUser,
  findUserByResetToken,
  updatePassword,
  findUserByEmail,
  createUser,
};
