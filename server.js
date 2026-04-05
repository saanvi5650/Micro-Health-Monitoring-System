require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const connectDB      = require("./config/db");
const authRoutes     = require("./routes/authRoutes");
const healthRoutes   = require("./routes/healthRoutes");

// ── Connect Database ──────────────────────────────────────
connectDB();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from /public (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth",   authRoutes);
app.use("/api/health", healthRoutes);

// ── Root → Landing page ───────────────────────────────────
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ message: "Route not found" });
    }
    res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Internal server error" });
});

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🏥 Health Monitor running → http://localhost:${PORT}\n`);
});