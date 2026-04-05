const User = require("../models/User");


// REGISTER
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existing = await User.findOne({ email });

        if (existing) {
            return res.json({ message: "User already exists" });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        res.json({ message: "Registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ message: "Wrong password" });
        }

        res.json({
            message: "Login successful",
            user: user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};