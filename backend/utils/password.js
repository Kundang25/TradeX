const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

function isBcryptHash(stored) {
  return typeof stored === "string" && stored.startsWith("$2");
}

async function verifyPassword(plainPassword, storedPassword) {
  if (!storedPassword) return false;

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  // Legacy plain-text passwords (auto-upgraded on login)
  return plainPassword === storedPassword;
}

module.exports = { hashPassword, verifyPassword, isBcryptHash };
