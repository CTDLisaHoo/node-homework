//controllers/userController.js

const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
const util = require("util");
const prisma = require("../db/prisma");
const { randomUUID } = require("crypto");
const jwt = require("jsonwebtoken");

const scrypt = util.promisify(crypto.scrypt);

const cookieFlags = (req) => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only when HTTPS is available
    sameSite: "Strict",
  };
};

const setJwtCookie = (req, res, user) => {

  console.log("Creating JWT for user ID:", user.id);
  console.log("New CSRF token generated");

  // Sign JWT
  const payload = { id: user.id, csrfToken: randomUUID() };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // 1 hour expiration

  console.log(
    "JWT fingerprint:",
    crypto.createHash("sha256").update(token).digest("hex").slice(0, 12)
  );
  // Set cookie.  Note that the cookie flags have to be different in production and in test.
  res.cookie("jwt", token, { ...cookieFlags(req), maxAge: 3600000 }); // 1 hour expiration
  return payload.csrfToken; // this is needed in the body returned by logon() or register()
};

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

  const { name, hashedPassword } = value;
  const email = value.email.toLowerCase().trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create user account (similar to Assignment 6, but using tx instead of prisma)
      const newUser = await tx.user.create({
        data: { email, name, hashedPassword },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });

      // Create 3 welcome tasks using createMany
      const welcomeTaskData = [
        { title: "Complete your profile", userId: newUser.id, priority: "medium" },
        { title: "Add your first task", userId: newUser.id, priority: "high" },
        { title: "Explore the app", userId: newUser.id, priority: "low" }
      ];
      await tx.task.createMany({ data: welcomeTaskData });

      // Fetch the created tasks to return them
      const welcomeTasks = await tx.task.findMany({
        where: {
          userId: newUser.id,
          title: { in: welcomeTaskData.map(t => t.title) }
        },
        select: {
          id: true,
          title: true,
          isCompleted: true,
          userId: true,
          priority: true
        }
      });

      return { user: newUser, welcomeTasks };
    });

    // Set JWT cookie and generate CSRF token
    const csrfToken = setJwtCookie(req, res, result.user);

    // Send response with status 201
    return res.status(201).json({
      user: {
        name: result.user.name,
        email: result.user.email,
      },
      csrfToken,
      welcomeTasks: result.welcomeTasks,
      transactionStatus: "success",
    });
  } catch (err) {
    if (err.code === "P2002") {
      // send the appropriate error back -- the email was already registered
      return res.status(400).json({ error: "Email already registered" });
    } else {
      return next(err); // the error handler takes care of other errors
    }
  }
};

const logon = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        hashedPassword: true
      }
    });

    const goodCredentials =
      user && await comparePassword(password, user.hashedPassword);

    if (!goodCredentials) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Set JWT cookie and generate CSRF token
    const csrfToken = setJwtCookie(req, res, user);

    // Send response with status 201
    return res.status(200).json({
      name: user.name,
      email: user.email,
      csrfToken,
    });

  } catch (err) {
    next(err);
  }
};

const logoff = (req, res) => {
  res.clearCookie("jwt", cookieFlags(req));

  res.status(200).json({ message: 'User logged off successfully' });
};

const show = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        error: "Invalid user ID"
      });
    }

    const allowedFields = ["id", "name", "email", "createdAt"];

    let selectedFields = allowedFields;

    if (req.query.fields) {
      selectedFields = req.query.fields
        .split(",")
        .map(field => field.trim())
        .filter(field => allowedFields.includes(field));

      if (selectedFields.length === 0) {
        return res.status(400).json({
          error: "Invalid fields requested"
        });
      }
    }

    const select = {};

    selectedFields.forEach(field => {
      select[field] = true;
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select
    });


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  logon,
  logoff,
  show,
  cookieFlags,
  setJwtCookie,
};