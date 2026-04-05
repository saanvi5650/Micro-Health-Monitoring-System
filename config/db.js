const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://username_db_user:password@cluster0.abcdsefg.mongodb.net/microhealth?retryWrites=true&w=majority"
        );
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;