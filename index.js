console.log('Happy developing ✨')
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3001;

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER || 'clinic_admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'wet_clinic',
    password: process.env.DB_PASS || 'secure_password',
    port: process.env.DB_PORT || 5432,
});

app.use(express.json());

// Example endpoint
app.get('/patients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM patients');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
