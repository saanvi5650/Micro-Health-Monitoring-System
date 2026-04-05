const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperature: Number,
    cough: Boolean,
    bp: Number,
    symptoms: String,
    riskLevel: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Health", healthSchema);