const AuthModel = require("../models/authModel");

const createAuthToken = (email, token) => {
  return new Promise(async (resolve, reject) => {
    const userAuth = await AuthModel.findOne({ email });
    if (!userAuth) {
      const auth = new AuthModel({
        email,
        authToken: token,
      });

      auth
        .save()
        .then((result) => resolve(result))
        .catch((err) => reject("Token addition error"));
    } else {
      AuthModel.updateOne({ email }, { $set: { authToken: token } })
        .then((result) => resolve(result))
        .catch((err) => reject("token addition error"));
    }
  });
};

module.exports = {
  createAuthToken,
};
