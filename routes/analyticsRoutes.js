//routes/analyticsRoutes.js

const express = require("express");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/users", analyticsController.getUsersWithStats);
router.get("/users/:id", analyticsController.getUserAnalytics);
router.get("/tasks/search", analyticsController.searchTasks);

module.exports = router;