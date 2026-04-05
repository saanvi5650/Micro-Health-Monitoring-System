const Health = require("../models/Health");

// Risk calculation
const calculateRisk = (temperature, cough, bp) => {
    let score = 0;

    if (temperature > 38) score += 2;
    if (cough === true) score += 1;
    if (bp > 140) score += 2;

    if (score >= 4) return "High";
    if (score >= 2) return "Medium";
    return "Low";
};

// Submit health report

exports.submitHealth = async (req, res) => {
    console.log("🔥 NEW CODE RUNNING");
console.log("🔥 API HIT");
console.log("Incoming Data:", req.body);
    const { name, age, temperature, cough, bp, symptoms } = req.body;

    const riskLevel = calculateRisk(temperature, cough, bp);

    try {
        const newReport = new Health({
            name,
            age,
            temperature,
            cough,
            bp,
            symptoms,
            riskLevel
        });

        await newReport.save();
        console.log("✅ Data saved to MongoDB:", newReport);
        res.json({
            message: "Health report submitted successfully",
            riskLevel: riskLevel
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const data = await Health.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get alerts (High risk only)
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Health.find({ riskLevel: "High" });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};