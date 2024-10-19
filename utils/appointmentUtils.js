import db from "../config/db.js";

// Returns an array of valid time slots for appointments
export const getValidTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 11 && minute === 30) continue; // Skip lunch break
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return slots;
};

// Checks if the given time is a valid appointment time
export const isValidAppointmentTime = (time) => {
  const validSlots = getValidTimeSlots();
  return validSlots.includes(time);
};

// Returns the day of the week for a given date
export const getDayOfWeek = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = new Date(date).getDay();
  return days[dayIndex];
};

// Checks if the given date is in the past
export const isPastDate = (date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < currentDate;
};

// Checks if the appointment time is one hour or later from the current time
export const isWithinMinimumTimeBuffer = (appointmentDate, appointmentTime) => {
  const now = new Date();
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const timeDifference = appointmentDateTime.getTime() - now.getTime();
  const oneHourInMilliseconds = 60 * 60 * 1000;
  return timeDifference < oneHourInMilliseconds;
};

// Checks if the appointment date is within four weeks from the current date
export const isWithinFourWeeks = (appointmentDate) => {
  const currentDate = new Date();
  const fourWeeksFromNow = new Date(
    currentDate.getTime() + 28 * 24 * 60 * 60 * 1000
  );
  const appointmentDateObj = new Date(appointmentDate);
  return appointmentDateObj <= fourWeeksFromNow;
};

// Checks if the given date is today's date or in the future
export const isFutureDate = (date) => {
  const currentDate = new Date();
  return new Date(date) >= currentDate;
};


// Checks if the appointment time is within the 24 hour cancellation window
export const isWithinCancellationWindow = (appointmentDate, windowInHours) => {
  const currentDate = new Date();
  const windowInMilliseconds = windowInHours * 60 * 60 * 1000;
  return (
    new Date(appointmentDate).getTime() - currentDate.getTime() >=
    windowInMilliseconds
  );
};

// Counts the number of future appointments for a patient
export const checkFutureAppointments = async (patientId) => {
  const query = `
    SELECT COUNT(*) AS appointmentCount
    FROM appointments
    WHERE patient_id = ? AND appointment_date >= CURDATE()
  `;
  const [result] = await db.query(query, [patientId]);
  return result[0].appointmentCount;
};

// Checks if a specific time slot is available for a doctor
export const isTimeSlotAvailable = async (doctor_id, appointment_date, start_time) => {
  const checkSlotQuery = `
    SELECT id FROM appointments
    WHERE doctor_id = ? AND appointment_date = ? AND start_time = ? AND status = 'booked'
  `;
  const [existingBooking] = await db.query(checkSlotQuery, [
    doctor_id,
    appointment_date,
    start_time,
  ]);

  return existingBooking.length === 0;
};

// Checks if a patient has a conflicting appointment on the same day at the same time
export const hasConflictingAppointment = async (patient_id, appointment_date, start_time, excludeAppointmentId = null) => {
  let query = `
    SELECT id FROM appointments
    WHERE patient_id = ? AND appointment_date = ? AND start_time = ? AND status IN ('booked', 'updated')
  `;
  const params = [patient_id, appointment_date, start_time];

  // If an appointment ID is provided to exclude, add it to the query
  if (excludeAppointmentId) {
    query += " AND id != ?";
    params.push(excludeAppointmentId);
  }

  const [conflictingAppointments] = await db.query(query, params);
  return conflictingAppointments.length > 0;
};
