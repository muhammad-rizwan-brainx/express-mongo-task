const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const hashPassword = async (password) => {
  console.log("here")
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error("Failed to hash password");
  }
};
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

    const hashedPassword = await hashPassword(password);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName,
      email,
      password: hashedPassword,
    });
    console.log(user)
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

const findUserByResetToken = async (resetToken) => {
  try {
    const user = await User.findOne({ resetToken });
    return user;
  } catch (error) {
    throw new Error('Failed to find user by reset token.');
  }
};

module.exports = {
  checkExistingUser,
  findUserByResetToken,
  updatePassword,
  findUserByEmail,
  createUser
};