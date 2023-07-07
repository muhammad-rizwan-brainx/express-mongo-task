const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
    
  } catch (error) {
    throw new Error("Failed to hash password");
  }
};

module.exports = {
  hashPassword,
};
