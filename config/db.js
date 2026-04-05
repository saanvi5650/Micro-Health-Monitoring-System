const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://saanvi0565_db_user:saanvi05@cluster0.7hkqpbd.mongodb.net/microhealth?retryWrites=true&w=majority"
        );
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;