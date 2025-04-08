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

router.post("/appointment", async (req, res) => {
    const { doctor_id, patient_id, appointment_date } = req.body;

    if (!doctor_id || !patient_id || !appointment_date) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO appointments (doctor_id, patient_id, appointment_date)
             VALUES ($1, $2, $3) RETURNING id`,
            [doctor_id, patient_id, appointment_date]
        );

        res.status(201).json({ message: "Appointment created successfully!", id: result.rows[0].id });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Failed to create appointment." });
    }
});

router.get("/appointments", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM appointments`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments." });
    }
});

router.put("/appointment/:id", async (req, res) => {
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
        res.status(500).json({ message: "Failed to update appointment." });
    }
});

router.delete("/appointment/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM appointments WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json({ message: "Appointment deleted successfully!" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Failed to delete appointment." });
    }
});

export const reservationRoutes = router;
