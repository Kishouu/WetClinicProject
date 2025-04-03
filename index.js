const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3001;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // ✅ Ensures JSON request body is properly parsed

app.use(
    session({
        secret: process.env.SESSION_SECRET || "yourSecretKey",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1-day expiry
    })
);

const pool = new Pool({
    user: process.env.DB_USER || "clinic_admin",
    host: process.env.DB_HOST || "wetclinic_db",
    database: process.env.DB_NAME || "wet_clinic",
    password: process.env.DB_PASS || "secure_password",
    port: process.env.DB_PORT || 5432,
});

// ✅ Check database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
    } else {
        console.log("Connected to the database.");
    }
    release();
});

// ✅ User registration endpoint
app.post("/register", async (req, res) => {
    console.log("Received registration request:", req.body); // Debugging log

    const { username, email, password, fullName, phoneNumber } = req.body;

    if (!username || !email || !password || !fullName || !phoneNumber) {
        console.error("Missing fields:", { username, email, password, fullName, phoneNumber });
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.query(
            `INSERT INTO users (username, password_hash, email, full_name, phone_number, role)
             VALUES ($1, $2, $3, $4, $5, 'patient') RETURNING user_id`,
            [username, hashedPassword, email, fullName, phoneNumber]
        );

        const userId = userResult.rows[0].user_id;
        await pool.query(`INSERT INTO patients (user_id, name) VALUES ($1, $2)`, [userId, fullName]);

        res.status(201).json({ message: "Patient registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed.", error: error.message });
    }
});

// ✅ User login endpoint with session handling
app.post("/login", async (req, res) => {
    console.log("Received login request:", req.body); // Debugging log

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

        console.log("Session after login:", req.session); // ✅ Debug session

        res.status(200).json({ message: "Login successful!", user: req.session.user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed.", error: error.message });
    }
});

// ✅ Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
