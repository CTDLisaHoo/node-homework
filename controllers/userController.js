//controllers/userController.js

const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
const util = require("util");
const pool = require("../db/pg-pool");

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

  let result = null;
  value.hashed_password = await hashPassword(value.password);
  // the code to here is like the in-memory version
  try {
    result = await pool.query(
      `INSERT INTO users (email, name, hashed_password)
      VALUES ($1, $2, $3) 
      RETURNING id, email, name`,
      [value.email, value.name, value.hashed_password]
    ); 
  } catch (e) { 
    if (e.code === "23505") { 
      return res.status(400).json({
        message: "Email already registered",
      });
    }
    return next(e); 
  }
  const user = result.rows[0];

  global.user_id = user.id;

  res.status(201).json({
    name: user.name,
    email: user.email,
  });

};

const logon = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const usersResult = await pool.query(
      `SELECT id, name, email, hashed_password
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = usersResult.rows[0];

    const goodCredentials =
      user && await comparePassword(password, user.hashed_password);

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