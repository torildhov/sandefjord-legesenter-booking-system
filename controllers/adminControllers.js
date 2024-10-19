import db from "../config/db.js";

//GET A LIST OF ALL DOCTORS
export const getDoctors = async (req, res) => {
  try {
    const [doctors] = await db.query(
      "SELECT id, doctor_name, specialisation, availability FROM doctors"
    );

    // Check if any doctors were found
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found", doctors: [] });
    }
    
    //Format the availability data
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const formattedDoctors = doctors.map((doctor) => {
      const availability = doctor.availability || {};
      const weeklySchedule = availability.weekly_schedule || {};

      const sortedWeeklySchedule = Object.fromEntries(
        Object.entries(weeklySchedule).sort(([a], [b]) => {
          return dayOrder.indexOf(a) - dayOrder.indexOf(b);
        })
      );

      return {
        id: doctor.id,
        name: doctor.doctor_name,
        specialisation: doctor.specialisation,
        availability: {
          weekly_schedule: sortedWeeklySchedule,
          exceptions: availability.exceptions || {},
        },
      };
    });

    // Return a list of doctors with formatted availability data
    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors: formattedDoctors
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch doctors." });
  }
};


//ADD A NEW DOCTOR
export const addDoctor = async (req, res) => {
  // Extract doctor information from the request body
  const { doctor_name, specialisation, availability } = req.body;

  // Validate input presence
  if (!doctor_name || !specialisation || !availability) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if a doctor with the same name already exists
    const [existingDoctor] = await db.query(
      "SELECT * FROM doctors WHERE doctor_name = ?",
      [doctor_name]
    );

    // If a doctor with the same name exists, return an error
    if (existingDoctor.length > 0) {
      return res
        .status(400)
        .json({ message: "A doctor with this name already exists" });
    }

    // Insert the new doctor into the database
    const [result] = await db.query(
      "INSERT INTO doctors (doctor_name, specialisation, availability) VALUES (?, ?, ?)",
      [doctor_name, specialisation, JSON.stringify(availability)]
    );

    // Send a successful response with the new doctor's information
    res
      .status(201)
      .json({
        message: "Doctor added successfully",
        doctorId: result.insertId,
        doctorName: doctor_name,
      });
  } catch (error) {
    console.error("Error adding doctor:");
    res.status(500).json({ error: "Internal server error" });
  }
};


//UPDATE AN EXISTING DOCTOR
export const updateDoctor = async (req, res) => {
  // Extract the doctor ID from the request parameters
  const doctorId = req.params.doctorId;
  // Extract the availability information from the request body
  const { availability } = req.body;

  // Validate that availability is provided
  if (!availability) {
    return res.status(400).json({ message: 'Availability is required' });
  }

  // Validate that availability is in the correct format (object)
  if (typeof availability !== 'object') {
    return res.status(400).json({ message: 'Invalid availability format' });
  }

  try {
    // Check if the doctor exists in the database
    const [existingDoctor] = await db.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);

    if (existingDoctor.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update the doctor's availability in the database
    const [result] = await db.query('UPDATE doctors SET availability = ? WHERE id = ?', [JSON.stringify(availability), doctorId]);

    res.status(200).json({ message: 'Doctor availability updated successfully', doctorId: doctorId });

  } catch (error) {
    console.error('Error updating doctor availability');
    res.status(500).json({ message: 'Internal server error' });
  }
};


//DELETE AN EXISTING DOCTOR
export const deleteDoctor = async (req, res) => {
  // Extract the doctor ID from the request parameters
  const doctorId = req.params.doctorId;

  try {
    // Check if the doctor exists in the database
    const [existingDoctor] = await db.query(
      "SELECT * FROM doctors WHERE id = ?",
      [doctorId]
    );

    if (existingDoctor.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Delete the doctor from the database
    const [result] = await db.query("DELETE FROM doctors WHERE id = ?", [
      doctorId,
    ]);

    res.status(200).json({ message: "Doctor deleted successfully" });

  } catch (error) {
    console.error("Error deleting doctor:");
    res.status(500).json({ message: "Internal server error" });
  }
};


//GET BOOKED APPOINTMENTS
export const getBookedAppointments = async (req, res) => {
  try {
    // SQL query to fetch booked appointments with doctor and patient details
    const query = `
      SELECT 
        d.id AS doctor_id, 
        d.doctor_name, 
        a.appointment_date, 
        a.start_time, 
        a.patient_id, 
        u.user_name AS patient_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON a.patient_id = u.id
      WHERE a.status IN ('booked', 'updated')
      ORDER BY d.doctor_name, a.appointment_date, a.start_time
    `;

    // Execute the query
    const [appointments] = await db.query(query);

    // Organize appointments by doctor
    const appointmentsByDoctor = appointments.reduce(
      (accumulator, appointment) => {
        const {
          doctor_id,
          doctor_name,
          appointment_date,
          start_time,
          patient_id,
          patient_name,
        } = appointment;

        // Format the date and time
        const formattedDate = new Date(appointment_date)
          .toISOString()
          .split("T")[0];
        const formattedTime = start_time.slice(0, 5); // Remove seconds

        // Create or update the doctor's appointment list
        if (!accumulator[doctor_id]) {
          accumulator[doctor_id] = {
            doctor_id,
            doctor_name,
            appointments: [],
          };
        }
        accumulator[doctor_id].appointments.push({
          appointment_date: formattedDate,
          start_time: formattedTime,
          patient_id,
          patient_name,
        });
        return accumulator;
      },
      {}
    );

    // Send the successful response with organized appointment data
    res.status(200).json({
      message: "Appointments fetched successfully",
      appointmentsByDoctor: Object.values(appointmentsByDoctor)
    });
    
  } catch (error) {
    console.error("Failed to get booked appointments:", error);
    res.status(500).json({ message: "Failed to get booked appointments" });
  }
};
