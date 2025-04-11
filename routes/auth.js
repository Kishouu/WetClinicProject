import express from "express";
import pkg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const router = express.Router();
const { Pool } = pkg;

// PostgreSQL Configuration
const pool = new Pool({
    user: process.env.DB_USER || "clinic_admin",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "wet_clinic",
    password: process.env.DB_PASS || "secure_password",
    port: process.env.DB_PORT || 5432,
});

// Rate Limiter (Prevent brute-force attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max requests per IP during windowMs
    message: "Too many requests from this IP, please try again later.",
});
router.use(limiter);

// Registration Route
router.post("/register", async (req, res) => {
    const { username, email, password, fullName, phoneNumber } = req.body;

    if (!username || !email || !password || !fullName || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const userResult = await pool.query(
            `INSERT INTO users (username, password_hash, email, full_name, phone_number, role)
             VALUES ($1, $2, $3, $4, $5, 'patient') RETURNING user_id`,
            [username, hashedPassword, email, fullName, phoneNumber]
        );

        // Store user session
        req.session.user = {
            userId: userResult.rows[0].user_id,
            username: username,
            role: "patient",
        };

        res.status(201).json({ message: "Registration successful!", user: req.session.user });
    } catch (error) {
        console.error("Registration Error:", error);

        // Handle unique constraint error for username or email
        if (error.code === "23505") {
            return res.status(400).json({ message: "Username or email already exists." });
        }

        res.status(500).json({ message: "Registration failed.", error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { userIdentifier, password } = req.body;

    if (!userIdentifier || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        // Query user by username or email
        const userResult = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1`,
            [userIdentifier]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = userResult.rows[0];

        // Compare provided password with stored hash
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Store user session
        req.session.user = {
            userId: user.user_id,
            username: user.username,
            role: user.role,
        };

        res.status(200).json({ message: "Login successful!", user: req.session.user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed.", error: error.message });
    }
});

// Logout Route
router.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Logout Error:", err);
                return res.status(500).json({ message: "Failed to log out." });
            }

            res.clearCookie("connect.sid"); // Clear the session cookie
            res.status(200).json({ message: "Logout successful!" });
        });
    } else {
        res.status(400).json({ message: "No active session." });
    }
});

// Get Current User Route
router.get("/me", (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: "Not logged in." });
    }
});

export const authRoutes = router;
