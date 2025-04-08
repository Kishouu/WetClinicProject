import express from "express";
import pkg from "pg";

const router = express.Router();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "clinic_admin",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "wet_clinic",
    password: process.env.DB_PASS || "secure_password",
    port: process.env.DB_PORT || 5432,
});

router.get("/", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const result = await pool.query(
            `SELECT username, email, full_name, phone_number FROM users WHERE user_id = $1`,
            [req.session.user.userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

export const getProfileRoutes = router;
