//controllers/userController.js

const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
};

const comparePassword = async (inputPassword, storedHash) => {
  if (typeof storedHash !== "string") {
    return false;
  }

  const [salt, key] = storedHash.split(":");

  if (!salt || !key || !/^[a-f0-9]{128}$/i.test(key)) {
    return false;
  }

  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scrypt(inputPassword, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
};

const register = async (req, res) => {
  if (!req.body) req.body = {};

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  const { name, email, password } = value;
  const hashedPassword = await hashPassword(password);

  const newUser = {
    name,
    email,
    hashedPassword,
  };

  global.users.push(newUser);
  global.user_id = newUser;

  res.status(201).json({ name, email });
};

const logon = async (req, res) => {
  const { email, password } = req.body || {};

  const user = global.users.find(
    (user) => user.email === email
  );

  const goodCredentials =
    user && await comparePassword(password, user.hashedPassword);

  if (!goodCredentials) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  global.user_id = user;

  res.status(200).json({
    name: user.name,
    email: user.email,
  });
};

const logoff = (req, res) => {
  global.user_id = null;

  res.status(200).json({ message: 'User logged off successfully' });
};

module.exports = {
  register,
  logon,
  logoff,
};