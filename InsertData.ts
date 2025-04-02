import { Client } from 'pg';

// Database connection configuration
const client = new Client({
    user: 'clinic_admin',
    host: 'localhost',
    database: 'wet_clinic',
    password: 'secure_password',
    port: 5432
});

async function insertData() {
    try {
        await client.connect();

        // Insert Admin
        const adminResult = await client.query(
            "INSERT INTO users (username, password_hash, email, full_name, role) VALUES ('admin1', 'hashed_password', 'admin@example.com', 'Admin One', 'admin') RETURNING user_id"
        );
        const adminId = adminResult.rows[0].user_id;
        await client.query(`INSERT INTO admin (user_id, name, specialization) VALUES (${adminId}, 'Admin One', 'System Management')`);

        // Insert Doctors
        const doctorIds = [];
        for (let i = 1; i <= 3; i++) {
            const doctorResult = await client.query(
                `INSERT INTO users (username, password_hash, email, full_name, role) VALUES ('doctor${i}', 'hashed_password', 'doctor${i}@example.com', 'Doctor ${i}', 'doctor') RETURNING user_id`
            );
            const doctorId = doctorResult.rows[0].user_id;
            doctorIds.push(doctorId);
            await client.query(`INSERT INTO doctors (user_id, name, specialization) VALUES (${doctorId}, 'Doctor ${i}', 'Specialization ${i}')`);
        }

        // Insert Patients
        const patientIds = [];
        for (let i = 1; i <= 3; i++) {
            const patientResult = await client.query(
                `INSERT INTO users (username, password_hash, email, full_name, role) VALUES ('patient${i}', 'hashed_password', 'patient${i}@example.com', 'Patient ${i}', 'patient') RETURNING user_id`
            );
            const patientId = patientResult.rows[0].user_id;
            patientIds.push(patientId);
            await client.query(`INSERT INTO patients (user_id, name, age, appointment_date) VALUES (${patientId}, 'Patient ${i}', ${20 + i}, '2025-04-10')`);
        }

        // Insert Prescriptions
        for (let i = 0; i < 3; i++) {
            await client.query(
                `INSERT INTO prescriptions (doctor_id, patient_id, medication, dosage, instructions) 
                 VALUES (${doctorIds[i]}, ${patientIds[i]}, 'Medication ${i+1}', '500mg', 'Take twice daily')`
            );
        }

        // Insert Treatments
        for (let i = 0; i < 3; i++) {
            await client.query(
                `INSERT INTO treatments (patient_id, treatment_type, description, start_date, end_date) 
                 VALUES (${patientIds[i]}, 'Treatment ${i+1}', 'Description of treatment ${i+1}', '2025-04-01', '2025-04-15')`
            );
        }

        console.log("Data inserted successfully!");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        await client.end();
    }
}

insertData();
