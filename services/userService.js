const mongoose = require("mongoose");
const User = require("../models/userModel");
const hashPassword = require("../utils/hashPassword");

const checkExistingUser = async (email) => {
  try {
    const existingUser = await User.findOne({ email });
    return existingUser;

  } catch (error) {
    throw new Error('Failed to check existing user.');
  }
};

const createUser = async (userData) => {
  try {
    const { userName, email, password } = userData;

    const hashedPassword = await hashPassword.hashPassword(password);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName,
      email,
      password: hashedPassword,
    });

    await user.save();

  } catch (error) {
    throw new Error('Failed to create user.');
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;

  } catch (error) {
    throw new Error('Failed to find user by email.');
  }
};

const updatePassword = async (user, newPassword) => {
  try {
    user.password = newPassword;
    user.resetToken = null;
    
    await user.save();

  } catch (error) {
    throw new Error('Failed to update user password.');
  }
};

const findUserByResetToken = async (resetPasswordToken) => {
  try {
    const user = await User.findOne({ resetPasswordToken });
    return user;

  } catch (error) {
    throw new Error('Failed to find user by reset token.');
  }
};

const updateResetToken = async (user, resetToken, expiration) => {
  try {
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiration;

    await user.save();

  } catch (error) {
    throw new Error(
      "Failed to update user reset password token and expiration."
    );
  }
};

module.exports = {
  updateResetToken,
  checkExistingUser,
  findUserByResetToken,
  updatePassword,
  findUserByEmail,
  createUser
};