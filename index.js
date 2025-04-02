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
app.use(express.json());

app.use(
    session({
        secret: "yourSecretKey",
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

// User registration endpoint
app.post("/register", async (req, res) => {
    const { username, email, password, role, fullName, phoneNumber } = req.body;

    if (!username || !email || !password || !role || !fullName || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (username, password_hash, email, full_name, phone_number, role) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
            [username, hashedPassword, email, fullName, phoneNumber, role]
        );

        res.status(201).json({ message: "User registered successfully!", user_id: result.rows[0].user_id });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed.", error: error.message });
    }
});

// User login endpoint
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
        res.status(500).json({ message: "Login failed.", error: error.message });
    }
});

// Add an appointment
app.post("/appointment", async (req, res) => {
    const { doctor_id, patient_id, appointment_date } = req.body;

    if (!doctor_id || !patient_id || !appointment_date) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO public.appointments (doctor_id, patient_id, appointment_date)
             VALUES ($1, $2, $3) RETURNING id`,
            [doctor_id, patient_id, appointment_date]
        );

        res.status(201).json({ message: "Appointment created successfully!", id: result.rows[0].id });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Failed to create appointment." });
    }
});

// Get all appointments
app.get("/appointments", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM appointments`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments.", error: error.message });
    }
});

// Update an appointment
app.put("/appointment/:id", async (req, res) => {
    const { id } = req.params;
    const { doctor_id, patient_id, appointment_date } = req.body;

    if (!doctor_id && !patient_id && !appointment_date) {
        return res.status(400).json({ message: "At least one field must be provided to update!" });
    }

    try {
        const fields = [];
        const values = [];
        let counter = 1;

        if (doctor_id) {
            fields.push(`doctor_id = $${counter}`);
            values.push(doctor_id);
            counter++;
        }
        if (patient_id) {
            fields.push(`patient_id = $${counter}`);
            values.push(patient_id);
            counter++;
        }
        if (appointment_date) {
            fields.push(`appointment_date = $${counter}`);
            values.push(appointment_date);
            counter++;
        }

        values.push(id);
        const query = `UPDATE appointments SET ${fields.join(", ")} WHERE id = $${counter} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Failed to update appointment.", error: error.message });
    }
});

// Delete an appointment
app.delete("/appointment/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM appointments WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json({ message: "Appointment deleted successfully!" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Failed to delete appointment.", error: error.message });
    }
});

// Get all appointments for a specific patient
app.get("/appointments/patient/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM appointments WHERE patient_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No appointments found for the given patient." });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments for patient:", error);
        res.status(500).json({ message: "Failed to fetch appointments for the patient.", error: error.message });
    }
});

// Get all appointments for a specific doctor
app.get("/appointments/doctor/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM appointments WHERE doctor_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No appointments found for the given doctor." });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments for doctor:", error);
        res.status(500).json({ message: "Failed to fetch appointments for the doctor.", error: error.message });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
