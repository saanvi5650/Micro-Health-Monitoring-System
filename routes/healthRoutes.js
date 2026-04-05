const express = require("express");
const router = express.Router();

const {
    submitHealth,
    getReports,
    getAlerts
} = require("../controllers/healthController");

router.post("/submit-health", submitHealth);
router.get("/reports", getReports);
router.get("/alerts", getAlerts);

module.exports = router;