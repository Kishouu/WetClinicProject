CREATE TABLE patients (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          age INT NOT NULL,
                          appointment_date DATE NOT NULL
);

CREATE TABLE doctors (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         specialization VARCHAR(255) NOT NULL
);
CREATE TABLE admin (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         specialization VARCHAR(255) NOT NULL
);
