//routes/analyticsRoutes.js

const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

const router = express.Router();
router.use(jwtMiddleware);

router.get("/users", analyticsController.getUsersWithStats);
router.get("/users/:id", analyticsController.getUserAnalytics);
router.get("/tasks/search", analyticsController.searchTasks);

module.exports = router;