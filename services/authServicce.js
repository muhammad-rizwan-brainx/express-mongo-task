const AuthModel = require("../models/authModel");

const createAuthToken = async (email, token) => {
  try {
    const userAuth = await AuthModel.findOne({ email });

    if (!userAuth) {
      const auth = new AuthModel({
        email,
        authToken: token,
      });

      await auth.save();

      return "New User Token Added";
    } else {
      await AuthModel.updateOne({ email }, { $set: { authToken: token } });
    }

    return "Token Updated";
  } catch (error) {
    throw new Error("Failed to create or update authentication token.");
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
  createAuthToken,
};
