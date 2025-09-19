require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "please_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10)
};
