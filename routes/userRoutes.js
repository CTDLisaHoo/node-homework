//routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", userController.register);
router.post("/logon", userController.logon);
router.post("/logoff", userController.logoff);
router.get("/:id", auth, userController.show);

module.exports = router;