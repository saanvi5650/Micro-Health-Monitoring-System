const express = require("express");
const router = express.Router();

const { testAPI } = require("../controllers/testController");

// Test route
router.get("/test", testAPI);

// Health route
router.get("/health", (req, res) => {
    res.json({
        status: "Server Healthy",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

module.exports = router;