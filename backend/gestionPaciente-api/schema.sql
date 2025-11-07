CREATE TABLE IF NOT EXISTS data_patients (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    age INTEGER,
    birth_date DATE,
    address VARCHAR(255),
    city VARCHAR(100),
    neighborhood VARCHAR(100),
    gender VARCHAR(10),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
