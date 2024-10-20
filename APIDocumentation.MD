# Simplified API Documentation for testing the API endpoint for the Sandefjord Legesenter application

The following API documentation provides an overview of the API endpoints and how to test them for the Sandefjord Legesenter application. For a complete and comprehensive documentation of the API, with all possible responses and error messages, please see the [README](README.md) file.

For more details on how to install the project, please see the [README](README.md) file.

## Using Bearer Token for Protected Routes

To access protected endpoints, you need to include the JWT token in the `Authorization` header of your HTTP request. This token is obtained from the response of a successful login request.

### Steps to Add Bearer Token in Postman

1. **Login to Obtain Token:**
   - Send a POST request to `/api/auth/login` with the requred email and password from a created user.
   - Copy the `token` from the response body.

2. **Add Token to Authorization Header:**
   - In Postman, select the request you want to send to a protected endpoint.
   - Go to the "Authorization" tab.
   - Select "Bearer Token" from the Type dropdown.
   - Paste the copied token into the "Token" field.

3. **Send the Request:**
   - Ensure the token is correctly added and send your request to the protected endpoint.

For more details on how to add the token in Postman, see the [Postman documentation](https://learning.postman.com/docs/sending-requests/authorization/authorization-types/#bearer-token).

4. **After Logging Out:**
   - After logging out, remove the token from the `Authorization` headers from all used enpoints to simulate a real-world scenario where the user's session is terminated and the token is no longer valid.

# API Documentation

## Authentication and User Management

| Endpoint                  | Method | Description                      | Request Body                                                                                   | Example Response                                                                                   |
|---------------------------|--------|----------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `/api/auth/register`      | POST   | Register a new user (patient)    | `{ "user_name": "Emma Anderson", "email": "emma.anderson@gmail.com", "password": "password" }` | `{ "message": "User registered successfully." }`                                                   |
| `/api/auth/login`         | POST   | Login an existing user           | `{ "email": "emma.anderson@gmail.com", "password": "password" }`                               | `{ "message": "Login successful.", "token": "<JWT_TOKEN>" }`                                       |
| `/api/auth/logout`        | POST   | Logout a user                    | None                                                                                           | `{ "message": "Logout successful." }`                                                              |

## Appointment Management (for Patients)
**Note:** Replace `:appointmentId` with the actual ID of the appointment you want to change or delete.


| Endpoint                                      | Method | Description                                         | Request Body                                                                                   | Example Response                                                                                   |
|-----------------------------------------------|--------|-----------------------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `/api/appointments`                           | GET    | Fetch available time slots for booking              | None                                                                                           | `{ "message": "Available timeslots fetched successfully", "doctorsWithAppointments": [...] }`      |
| `/api/appointments`                           | POST   | Book an appointment                                 | `{ "doctor_id": 1, "appointment_date": "2024-10-25", "start_time": "10:30" }`                 | `{ "message": "Booking confirmed for Friday, 2024-10-25 at 10:30 with Dr. Carol White" }`          |
| `/api/appointments/:appointmentId`            | PUT    | Change an existing appointment                      | `{ "doctor_id": 2, "appointment_date": "2024-10-25", "start_time": "10:30" }`                 | `{ "message": "Appointment changed to Friday, 2024-10-25 at 10:30 with Dr. Bob Smith" }`           |
| `/api/appointments/:appointmentId`            | DELETE | Delete an existing appointment                      | None                                                                                           | `{ "message": "Appointment successfully cancelled." }`                                             |

## Administration (for Doctor's Office Employees)

### Logging in as Admin

To perform administrative tasks, you need to log in as an admin user. First, make sure that all previous JWT tokens are removed/cleared from the `Authorization` headers of previously used endpoints. Paste the following JSON in the request body at the login endpoint `/api/auth/login`.

```json
{
"email": "admin@sandefjord.legesenter.no",
"password": "adminpassword"
}

```

Once logged in, you will receive a JWT token. Use this token to access the protected admin endpoints by including it in the `Authorization` header as a Bearer Token in each of the admin endpoints. 

### Admin Endpoints 
**Note:** Replace `:doctorId` with the actual ID of the doctor you want to update or delete.

| Endpoint                      | Method | Description                             | Request Body                                                                                   | Example Response                                                                                   |
|-------------------------------|--------|-----------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `/api/admin/doctors`          | GET    | Fetch a list of doctors                 | None                                                                                           | `{ "message": "Doctors fetched successfully." }`                                                   |
| `/api/admin/doctors`          | POST   | Add a new doctor                        | `{ "doctor_name": "Dr. Heidi Hem", "specialisation": "Pediatrics", "availability": { "weekly_schedule": { "Monday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Tuesday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Wednesday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Thursday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Friday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"] }, "exceptions": { "2024-10-23": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"] } } }`   | `{ "message": "Doctor added successfully." }`                                                      |
| `/api/admin/doctors/:doctorId`| PUT    | Update an existing doctor               | `{ "availability": { "weekly_schedule": { "Monday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Tuesday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Wednesday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Thursday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"], "Friday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"] }, "exceptions": { "2024-10-24": ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"] } } }`                        | `{ "message": "Doctor availability updated successfully." }`                                       |
| `/api/admin/doctors/:doctorId`| DELETE | Delete a doctor                         | None                                                                                           | `{ "message": "Doctor deleted successfully." }`                                                    |
| `/api/admin/appointments`     | GET    | Fetch list of booked appointments       | None                                                                                           | `{ "message": "Appointments fetched successfully." }`                                              |