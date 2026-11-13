//controllers/userController.js

const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
const util = require("util");
const prisma = require("../db/prisma");

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

const register = async (req, res, next) => {
  if (!req.body) req.body = {};

  const { error, value } = userSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details,
    });
  }

  value.hashedPassword = await hashPassword(value.password);

  delete value.password;

  const { name, email, hashedPassword } = value;

  let user = null;
  try {
    user = await prisma.user.create({
      data: { name, email, hashedPassword },
      select: { name: true, email: true, id: true } // specify the column values to return
    });
  } catch (err) {
    if (err.name === "PrismaClientKnownRequestError" && err.code === "P2002") {
      return res.status(400).json({
        message: "Email already registered",
      });
    } else {
      return next(err);
    }
  }

  global.user_id = user.id;

  res.status(201).json({
    name: user.name,
    email: user.email,
  });
};

const logon = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    const goodCredentials =
      user && await comparePassword(password, user.hashedPassword);

    if (!goodCredentials) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    global.user_id = user.id;

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
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