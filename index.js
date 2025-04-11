import express from "express";
import path from "path";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.js";
import { reservationRoutes } from "./routes/reservation.js";
import { getProfileRoutes } from "./routes/getprofile.js";

dotenv.config();

const app = express();
const port = 3001;

// Middleware for static files
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());

// Route-specific middleware
app.use("/auth", authRoutes);
app.use("/reservation", reservationRoutes);
app.use("/getprofile", getProfileRoutes);

// Serve React (always serve index.html for frontend routes)
app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
