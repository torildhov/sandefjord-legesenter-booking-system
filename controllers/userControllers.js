import db from "../config/db.js";
import {
  getValidTimeSlots,
  isValidAppointmentTime,
  getDayOfWeek,
  isPastDate,
  isWithinMinimumTimeBuffer,
  isWithinFourWeeks,
  isFutureDate,
  isWithinCancellationWindow,
  checkFutureAppointments,
  isTimeSlotAvailable,
  hasConflictingAppointment
} from '../utils/appointmentUtils.js';

// GET ALL AVAILABLE APPOINTMENTS
export const availableAppointments = async (req, res) => {
  // Extract the date from the query parameters or use today's date
  let { date } = req.query;
  if (!date) {
    const today = new Date();
    date = today.toISOString().split('T')[0];
  }
  
  // Get the day of the week for the selected date
  const selectedWeekday = getDayOfWeek(date);

  // Check if the selected date is in the past
  if (isPastDate(date)) {
    return res.status(400).json({
      message: "No appointments available for past dates",
    });
  }

  // Check if the selected date is not Saturday or Sunday
  if (selectedWeekday === "Saturday" || selectedWeekday === "Sunday") {
    return res.status(400).json({
      message: "No appointments available for the specified date",
    });
  }
  
  try {
    // Query to get doctors available on the selected weekday
    const query = `
      SELECT d.id AS doctor_id, d.doctor_name, d.availability
      FROM doctors d
      WHERE JSON_EXTRACT(d.availability, CONCAT('$.weekly_schedule.', ?)) IS NOT NULL
    `;

    // Execute the query
    const [doctors] = await db.query(query, [selectedWeekday]);

    // Get the valid time slots for appointments
    const validTimeSlots = getValidTimeSlots();

    // Process each doctor's availability
    const doctorsWithAppointments = await Promise.all(
      doctors.map(async (doctor) => {
        const availability = doctor.availability;
        const availableSlots = availability.weekly_schedule[selectedWeekday] || [];
        const exceptions = availability.exceptions || {};

        // Remove slots that are in the exceptions for the given date
        const exceptionSlots = exceptions[date] || [];
        const filteredSlots = availableSlots.filter(slot => !exceptionSlots.includes(slot));

        // Query to get booked slots for the doctor on the selected date
        const bookedSlotsQuery = `
          SELECT start_time
          FROM appointments
          WHERE doctor_id = ? AND appointment_date = ? AND status = 'booked'
        `;
        const [bookedSlots] = await db.query(bookedSlotsQuery, [
          doctor.doctor_id,
          date,
        ]);

        const bookedTimes = bookedSlots.map((slot) =>
          slot.start_time.slice(0, 5)
        );

        // Filter out booked and invalid slots
        const finalAvailableSlots = filteredSlots.filter((slot) => {
          return (
            validTimeSlots.includes(slot) && // Ensure slot is valid
            !bookedTimes.includes(slot) &&
            !isWithinMinimumTimeBuffer(date, slot)
          );
        });

        // Return the doctor's information with available slots
        return {
          doctor_id: doctor.doctor_id,
          doctor_name: doctor.doctor_name,
          date: date,
          available_slots: finalAvailableSlots,
        };
      })
    );

    // Send the response with available appointments
    res.status(200).json({
      message: "Available time slots fetched successfully",
      doctorsWithAppointments
    });
    
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Failed to get available appointments:", error);
    res.status(500).json({ message: "Failed to get available time slots" });
  }
};


// BOOK A NEW APPOINTMENT
export const bookAppointment = async (req, res) => {
  // Extract appointment details from the request body
  const { doctor_id, appointment_date, start_time } = req.body;
  // Get the patient ID from the authenticated user
  const patientId = req.user.userId;

  // Validate that all required fields are present
  if (!doctor_id || !appointment_date || !start_time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the appointment date is in the past
  if (isPastDate(appointment_date)) {
    return res.status(400).json({ message: "Cannot book appointments for past dates" });
  }

  // Ensure the appointment start time is at least one hour in the future
  if (isWithinMinimumTimeBuffer(appointment_date, start_time)) {
    return res.status(400).json({ message: "Appointments must be booked at least one hour before the start time" });
  }

  // Validate that the appointment is within the allowed booking window (four weeks from today's date)
  if (!isWithinFourWeeks(appointment_date)) {
    return res.status(400).json({ message: "Appointments can only be booked up to 4 weeks in advance" });
  }

  // Ensure that the appointment date is not on a Saturday or Sunday
  const selectedWeekday = getDayOfWeek(appointment_date);
  if (selectedWeekday === "Saturday" || selectedWeekday === "Sunday") {
    return res.status(400).json({ message: "No appointments available for the specified date" });
  }

  try {
    // Check if the user has three or less future appointments booked
    const futureAppointments = await checkFutureAppointments(patientId);
    if (futureAppointments >= 3) {
      return res.status(400).json({ message: "You can only have a maximum of three future appointments" });
    }

    // Verify if the selected time slot is available
    const isAvailable = await isTimeSlotAvailable(doctor_id, appointment_date, start_time);
    if (!isAvailable) {
      return res.status(400).json({ message: "This time slot is not available" });
    }

    // Check for conflicting appointments with other doctors at the same start time and date
    const hasConflict = await hasConflictingAppointment(patientId, appointment_date, start_time);
    if (hasConflict) {
      return res.status(400).json({
        message: "You already have an appointment booked with another doctor at this time",
      });
    }

    // Fetch doctor details
    const getDoctorQuery = `
      SELECT availability, doctor_name
      FROM doctors
      WHERE id = ?
    `;
    const [doctorResult] = await db.query(getDoctorQuery, [doctor_id]);

    if (doctorResult.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorAvailability = doctorResult[0].availability;
    const doctorName = doctorResult[0].doctor_name;

    // Check doctor's availability
    const availableSlots = doctorAvailability.weekly_schedule[selectedWeekday] || [];
    const exceptions = doctorAvailability.exceptions || {};

    // Verify the selected time slot is not in the exceptions (not available) for the selected doctor
    const exceptionSlots = exceptions[appointment_date] || [];
    if (!availableSlots.includes(start_time) || exceptionSlots.includes(start_time)) {
      return res.status(400).json({ message: "The selected time slot is not available" });
    }

    // Insert the new appointment into the database
    const bookAppointmentQuery = `
      INSERT INTO appointments (doctor_id, patient_id, appointment_date, day, start_time, status)
      VALUES (?, ?, ?, ?, ?, 'booked')
    `;
    await db.query(bookAppointmentQuery, [
      doctor_id,
      patientId,
      appointment_date,
      selectedWeekday,
      start_time,
    ]);

    // Send success response for booking an appointment
    res.status(201).json({
      message: "Booking confirmed for " + selectedWeekday + ", " + appointment_date + " at " + start_time + " with " + doctorName
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

// CHANGE AN EXISTING APPOINTMENT
export const changeAppointment = async (req, res) => {
  // Extract appointment ID from request parameters
  const appointmentId = req.params.appointmentId;

  // Extract new appointment details from request body
  const { doctor_id, appointment_date, start_time } = req.body;

  // Get patient ID from authenticated user
  const patientId = req.user.userId;

  // Validate that all required fields are present
  if (!doctor_id || !appointment_date || !start_time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate that the appointment time is within the working hours of the doctor and of valid start time (whole and half hours)
  if (!isValidAppointmentTime(start_time)) {
    return res.status(400).json({ message: "Invalid appointment time" });
  }

  // Check if the appointment date is in the past
  if (isPastDate(appointment_date)) {
    return res.status(400).json({ message: "Choose today's date or a future date" });
  }

  // Ensure the appointment is at least one hour in the future
  if (isWithinMinimumTimeBuffer(appointment_date, start_time)) {
    return res.status(400).json({ message: "Appointments must be booked at least one hour in advance" });
  }

  // Validate that the appointment is within the allowed booking window (four weeks from today's date)
  if (!isWithinFourWeeks(appointment_date)) {
    return res.status(400).json({ message: "Appointments can only be booked up to four weeks in advance" });
  }

  // Ensure that the appointment is not on a Saturday or Sunday
  const selectedWeekday = getDayOfWeek(appointment_date);
  if (selectedWeekday === "Saturday" || selectedWeekday === "Sunday") {
    return res.status(400).json({ message: "No appointments available on the specificed date" });
  }

  try {
    // Check if the appointment exists and belongs to the user
    const checkExistingAppointmentQuery = `
      SELECT * FROM appointments WHERE id = ? AND patient_id = ?
    `;
    const [existingAppointment] = await db.query(checkExistingAppointmentQuery, [appointmentId, patientId]);

    if (existingAppointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const currentAppointment = existingAppointment[0];
    const currentDate = currentAppointment.appointment_date.toISOString().split("T")[0];
    const currentTime = currentAppointment.start_time.slice(0, 5);

    // Ensure that the appointment date, time and doctor id are not the same as the current ones
    if (
      currentAppointment.doctor_id.toString() === doctor_id.toString() &&
      currentDate === appointment_date &&
      currentTime === start_time
    ) {
      return res.status(400).json({
        message: "You have already booked this appointment with the same doctor, date, and time",
      });
    }

    // Ensure that there is no conflicting appointments with other doctors at the same start time and date
    const hasConflict = await hasConflictingAppointment(patientId, appointment_date, start_time, appointmentId);
    if (hasConflict) {
      return res.status(400).json({
        message: "You already have an appointment booked with another doctor at this time",
      });
    }

    // Verify if the selected time slot is available (not booked by another patient)
    const isAvailable = await isTimeSlotAvailable(doctor_id, appointment_date, start_time);
    if (!isAvailable) {
      return res.status(400).json({ message: "The selected time slot is not available" });
    }

    // Fetch doctor details
    const getDoctorQuery = `
      SELECT availability, doctor_name
      FROM doctors
      WHERE id = ?
    `;
    const [doctorResult] = await db.query(getDoctorQuery, [doctor_id]);

    if (doctorResult.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorAvailability = doctorResult[0].availability;
    const doctorName = doctorResult[0].doctor_name;

    // Check doctor's availability
    const availableSlots = doctorAvailability.weekly_schedule[selectedWeekday] || [];
    const exceptions = doctorAvailability.exceptions || {};

    // Verify the selected time slot is not in the exceptions section for the selected doctor
    const exceptionSlots = exceptions[appointment_date] || [];
    if (!availableSlots.includes(start_time) || exceptionSlots.includes(start_time)) {
      return res.status(400).json({ message: "The selected time slot is not available" });
    }

    // Update the appointment in the database
    const updateAppointmentQuery = `
      UPDATE appointments
      SET doctor_id = ?, appointment_date = ?, day = ?, start_time = ?, status = 'updated'
      WHERE id = ?
    `;
    const [updateResult] = await db.query(updateAppointmentQuery, [
      doctor_id,
      appointment_date,
      selectedWeekday,
      start_time,
      appointmentId,
    ]);

    //Verify that the selected appointment is not aleready the booked on the same day and time and with the same doctor
    if (updateResult.affectedRows === 0 || updateResult.changedRows === 0) {
      return res.status(400).json({
        message: "You already have an appointment booked at this time with the same doctor",
      });
    }

    // Send success response
    res.status(200).json({
      message: "Appointment changed to " + selectedWeekday + ", " + appointment_date + " at " + start_time + " with Dr. " + doctorName
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update the appointment" });
  }
};

// DELETE AN EXISTING APPOINTMENT
export const deleteAppointment = async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const patientId = req.user.userId;

  try {
    // Check if the appointment exists and belongs to the user
    const checkExistingAppointmentQuery = `
      SELECT * FROM appointments 
      WHERE id = ? AND patient_id = ?
    `;
    const [existingAppointment] = await db.query(
      checkExistingAppointmentQuery,
      [appointmentId, patientId]
    );

    if (existingAppointment.length === 0) {
      return res
        .status(404)
        .json({ message: "Appointment not found" });
    }

    const appointment = existingAppointment[0];

    // Check if the appointment is not in the past.
    if (!isFutureDate(appointment.appointment_date)) {
      return res
        .status(400)
        .json({ message: "Cannot cancel past appointments" });
    }

    // Check if the appointment is within the cancellation window (i.e., 24 hours)
    if (!isWithinCancellationWindow(appointment.appointment_date, 24)) {
      return res.status(400).json({
        message:
          "Appointments can only be cancelled at least 24 hours in advance",
      });
    }

    // Check if the appointment has status 'booked' or 'updated'
    if (appointment.status !== "booked" && appointment.status !== "updated") {
      return res.status(400).json({
        message: "Only booked or updated appointments can be deleted",
      });
    }

    // Delete the appointment
    const deleteAppointmentQuery = "DELETE FROM appointments WHERE id = ?";
    await db.query(deleteAppointmentQuery, [appointmentId]);

    res.status(200).json({ message: "Appointment successfully cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel the appointment" });
  }
};