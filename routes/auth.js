import express from "express";
import pkg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "clinic_admin",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "wet_clinic",
    password: process.env.DB_PASS || "secure_password",
    port: process.env.DB_PORT || 5432,
});

router.post("/register", async (req, res) => {
    console.log("Received registration request:", req.body);
    const { username, email, password, fullName, phoneNumber } = req.body;

    if (!username || !email || !password || !fullName || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.query(
            `INSERT INTO users (username, password_hash, email, full_name, phone_number, role)
             VALUES ($1, $2, $3, $4, $5, 'patient') RETURNING user_id`,
            [username, hashedPassword, email, fullName, phoneNumber]
        );

        req.session.user = {
            userId: userResult.rows[0].user_id,
            username: username,
            role: "patient",
        };

        res.status(201).json({ message: "Patient registered successfully!", user: req.session.user });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed.", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    console.log("Received login request:", req.body);
    const { userIdentifier, password } = req.body;

    try {
        const userResult = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1`,
            [userIdentifier]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

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

export const authRoutes = router;
