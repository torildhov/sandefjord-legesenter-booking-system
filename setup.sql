CREATE DATABASE eksamen_torild_katrine_hov;
USE eksamen_torild_katrine_hov;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'admin') DEFAULT 'patient',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(255) NOT NULL,
    specialisation VARCHAR(255),
    availability JSON
);

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT DEFAULT NULL,
    doctor_id INT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    status ENUM('booked', 'updated'),
    day VARCHAR(10),
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

SELECT * FROM doctors;

SELECT * FROM appointments;

SELECT * FROM users;


-- ADMIN USER DATA
-- passord: adminpassword. Hashed with cost factor 10 at https://bcrypt.online
INSERT INTO users (user_name, email, password, role)
VALUES ('adminUser', 'admin@sandefjord.legesenter.no', '$2y$10$9oVkXPyTj.nyj.pw3VACJO7a3LWFjEqtmca4n5Uf.0jPaogwe39HC', 'admin');

-- PATIENT USERS DATA
-- passord: password. Hashed with cost factor 10 at https://bcrypt.online
INSERT INTO users (user_name, email, password, role)
VALUES 
('Torild', 'torild.hov@gmail.com', '$2a$10$MEh.nIlxMj0zpeXrkR3q0eNN.qaHbpJKHyW/oIKbL7COlvrb22qwi', 'patient'),
('Viktor', 'viktor.hojman@gmail.com', '$2a$10$xAFJRMNgfBZMDAljfmhm9uG/LN9bfkM4zt5BELGiXRc6DtScxTsri', 'patient');


-- DOCTORS DATA
INSERT INTO doctors (doctor_name, specialisation, availability) VALUES
('Dr. Alice Johnson', 'General Practice', JSON_OBJECT(
    'weekly_schedule', JSON_OBJECT(
        'Monday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Tuesday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Wednesday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Thursday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Friday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30')
    ),
    'exceptions', JSON_OBJECT()
    )
)),
('Dr. Bob Smith', 'Pediatrics', JSON_OBJECT(
    'weekly_schedule', JSON_OBJECT(
        'Monday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Tuesday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Wednesday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Thursday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Friday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30')
    ),
    'exceptions', JSON_OBJECT()
)),
('Dr. Carol White', 'Dermatology', JSON_OBJECT(
    'weekly_schedule', JSON_OBJECT(
        'Monday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Tuesday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Wednesday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Thursday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'),
        'Friday', JSON_ARRAY('08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30')
    ),
    'exceptions', JSON_OBJECT()
));

-- BOOKING DATA
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, status, day)
VALUES 
(2, 3, '2024-11-18', '08:00:00', 'booked', 'Monday'),
(2, 1, '2024-11-19', '08:00:00', 'booked', 'Tuesday'),
(2, 2, '2024-11-20', '08:00:00', 'booked', 'Wednesday'),
(3, 3, '2024-11-18', '09:00:00', 'booked', 'Monday'),
(3, 1, '2024-11-19', '09:00:00', 'booked', 'Tuesday'),
(3, 2, '2024-11-20', '09:00:00', 'booked', 'Wednesday');








