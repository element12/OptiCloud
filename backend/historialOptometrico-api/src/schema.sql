CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    document VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS or MODIFY exams (

    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL DEFAULT NOW(),

    od_sphere NUMERIC(5,2),
    od_cylinder NUMERIC(5,2),
    od_axis INT,

    oi_sphere NUMERIC(5,2),
    oi_cylinder NUMERIC(5,2),
    oi_axis INT,

    observations TEXT,
    modification TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()

);

ALTER TABLE exams
    ADD COLUMN modification_date TIMESTAMP NOT NULL DEFAULT NOW()


SELECT * FROM exams


CREATE INDEX idx_exams_patient_id ON exams(patient_id);
