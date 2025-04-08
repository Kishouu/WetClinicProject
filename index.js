import express from "express";
import pkg from "pg";
import path from "path";
import bcrypt from "bcryptjs";
import session from "express-session";
import dotenv from "dotenv";

import { authRoutes } from "./routes/auth.js";
import { reservationRoutes } from "./routes/reservation.js";
import { getProfileRoutes } from "./routes/getprofile.js";

dotenv.config();

const app = express();
const port = 3001;
const { Pool } = pkg;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "yourSecretKey",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    })
);

const pool = new Pool({
    user: process.env.DB_USER || "clinic_admin",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "wet_clinic",
    password: process.env.DB_PASS || "secure_password",
    port: process.env.DB_PORT || 5432,
});

pool.connect()
    .then(() => console.log(" Connected to PostgreSQL"))
    .catch((err) => console.error(" Database connection error:", err.message));

app.use("/auth", authRoutes);
app.use("/reservation", reservationRoutes);
app.use("/getprofile", getProfileRoutes);

app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
