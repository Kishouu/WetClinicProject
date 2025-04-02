const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(
    session({
        secret: "yourSecretKey",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);

const pool = new Pool({
    user: process.env.DB_USER || "clinic_admin",
    host: process.env.DB_HOST || "wetclinic_db",
    database: process.env.DB_NAME || "wet_clinic",
    password: process.env.DB_PASS || "secure_password",
    port: process.env.DB_PORT || 5432,
});

app.post("/register", async (req, res) => {
    const { username, email, password, role, fullName, phoneNumber } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const existingUser = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "Username already taken. Choose another one." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `INSERT INTO users (username, password_hash, email, full_name, phone_number, role) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
            [username, hashedPassword, email, fullName, phoneNumber, role]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed.", error: error.message });
    }
});

app.post("/login", async (req, res) => {
    const { userIdentifier, password } = req.body;

    try {
        const userResult = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1`,
            [userIdentifier]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email/username or password." });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email/username or password." });
        }

        req.session.user = {
            userId: user.user_id,
            username: user.username,
            role: user.role,
        };

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed." });
    }
});

app.get("/patients", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    pool.query("SELECT * FROM patients")
        .then((result) => res.json(result.rows))
        .catch((err) => res.status(500).json({ error: "Failed to retrieve patient data." }));
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed." });
        res.json({ message: "Logged out successfully!" });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
