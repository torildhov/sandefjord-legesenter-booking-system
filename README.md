# Sandefjord Legesenter booking system 
This project is the backend system of an application that allows for effective appointment booking management at Sandefjord Legesenter. 


## Table of Contents
- [Sandefjord Legesenter booking system](#sandefjord-legesenter-booking-system)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
    - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Documentation](#api-documentation)
    - [Authentication and user management](#authentication-and-user-management)
      - [Register a new user (patient)](#register-a-new-user-patient)
      - [Login an existing user](#login-an-existing-user)
      - [Logout a user](#logout-a-user)
    - [Appointment management (for patients)](#appointment-management-for-patients)
      - [Fetch avaiable times slots for booking on a specific date](#fetch-avaiable-times-slots-for-booking-on-a-specific-date)
      - [Book an appointment](#book-an-appointment)
      - [Change an existing appointment](#change-an-existing-appointment)
      - [Delete an existing appointment](#delete-an-existing-appointment)
    - [Adminstration (for doctors office employees)](#adminstration-for-doctors-office-employees)
      - [Fetch a list of doctors](#fetch-a-list-of-doctors)
      - [Add a new doctor](#add-a-new-doctor)
      - [Update an existing doctor](#update-an-existing-doctor)
      - [Delete a doctor](#delete-a-doctor)
      - [Fetch list of booked appointments](#fetch-list-of-booked-appointments)
  - [Demo](#demo)

## About the Project
This project is the backend system of an application that allows for effective  appointment bookings management at Sandefjord Legesenter. The system is based on a RESTful API that allows for easy management of appointments, doctors and schedules. The system is built using Node.js, Express.js and a SQL database. The authentication is implemented using JWT (JSON Web Tokens) and is stored in cookies. Passwords are hashed using bcrypt. 

### Features
- User registration, login, and logout.
- View available time slots for each doctor based on dates and doctor's schedule.
- Users can book, change and cancel appointments.
- Admin can view a list of doctors and their weekly schedule with exempted dated time slots.
- Admin can add and delete doctors.
- Admin can update doctors available and exampted time slots.
- Admin can view a list of all booked apppointments.

## Tech Stack
- **Node.js** - Server-side JavaScript runtime environment.
- **Express** - Web framework for Node.js.
- **MySQL2** - Relational database management system.
- **JWT** - JSON Web Tokens for authentication.
- **bcrypt** - Password hashing library.
- **cookie-parser** - Middleware for parsing cookies.
- **dotenv** - Load environment variables from a .env file.
- **validator** - Library for input validation.
- **nodemon** - Utility for automatically restarting the server on file changes.

## Installation
Before you can run the application, you need to have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- MySQL (or a compatible database management system)
  
To run the project locally, follow these steps:


**1. Unpack the project**

Download the project file and open the zipped file to a desired location on your computer.

**2. Install dependencies**

Navigate to the project directory in your terminal and run the following command to install the required dependencies:

```npm install```

**3. Configure the database**

The first time you run the application, you need to create the database and tables. To do this, follow these steps:

1. Open the terminal

2. Use the following command to log into MySQL and run the ```setup.sql``` file:

   ```mysql -u student -p9p;-n5:CGw9q < path/to/setup.sql```
   
   Replace ```path/to/setup.sql``` with the actual path to the setup.sql file. This command will log in with the username ```student```and the password ```9p;-n5:CGw9q``` and thereafter run the ```setup.sql``` file which creates the database ```eksamen_torild_katrine_hov```and the necessary tables.


**4.Environment variables (if missing)** 
  
   ***Environment variables should allready be configured and found in the .env file in the root directory.*** If missing, create a new .env file in the root directory of the project and add the following keys:
    
      
    DB_HOST=localhost
    DB_USER=student
    DB_PASSWORD=9p;-n5:CGw9q
    DB_DATABASE=eksamen_torild_katrine_hov
    DB_PORT=3000
    URL=http://localhost
    JWT_SECRET=2c776b47cd6c8003db055f690b46178b8776292c80355e6b24b63623fc56407a888008829ee8500bb80eb28d16d25274e1a5342a38dfc8b07f51521d96884a2f80d47c236975baba5c3ae69368238a360fcdf39210e1aaa4382abbb52b3e051b7cff49e1a0c0db51c43c1c62765c562f77f0f1ddda966108adc86b11099a8e4134d0dc923bb8afd62ac0f2a57d8f22b04d70b5d2dee5f70eaa1ef963bd317889f56da826f208fdef96a99a5a68e08ac8b93f111fc7ffb8e34f02215c0d3c18b34a6ec6b4321cb6e48f31b8489e43bfafc9f7308373a88


**5. Run the application**

To start the application, run the following command in the terminal:

```npm run start``` - if you want to run the application in production mode.
 
 or

 ```npm run dev``` - if you want to run the application in development mode (with nodemon).

The application will start running on port 3000. You can access it by navigating to http://localhost:3000 in your web browser.

## Usage
To use the application, make sure the server is running. The default API endpoint is http://localhost:3000. Postman or other API testing tools can be used to interact with the API endpoints.

**For example:**
- To register a new user: POST to `http://localhost:3000/api/auth/register`
- To view available time slots for booking an appointment for a specific date: GET to `http://localhost:3000/api/appointments`

For complete information on the available endpoints and their usage, please refer to the API documentation in the next section.

## API Documentation
### Authentication and user management
Allows users to register, login and logout. Users are required to be logged in/authenticated to access all endpoints in the application except for the register and login endpoints.
#### Register a new user (patient)

**Method:** POST

**Endpoint:** `/api/auth/register`

**Request body:**
```json
{
  "user_name": "Emma Anderson",
  "email": "emma.anderson@gmail.com",
  "password": "password"
}
```

**Responses:**

**201 Created**

Register a new user.
```json
{
  "message": "User registered successfully."
}
```


**400 Bad Requests**

Validate inpuut fields - user_name, email, password are required.
```json
{
  "message": "All fields are required."
}
````

Validate email format - email must be a valid email address.
```json
{
  "message": "Invalid email format."
}
````

Validate username format - users name must contain letters and spaces only.
```json
{
  "message": "Your name must contain letters and spaces only."
}
````

Validate password format - password must be at least 8 characters long.
```json
{
  "message": "Password must be at least 8 characters long."
}
````

Check if user already exists based on email - email must be unique.
```json
{
  "message": "User already exists."
}
```
**500 Internal Server Error**

Catch error in registering user.
```json
{
  "message": "An error occured while registering the user."
}
```

#### Login an existing user

**Method:** POST

**Endpoint:** `/api/auth/login`

**Request body:**
```json
{
    "email": "emma.anderson@gmail.com",
    "password": "password"
}
```

**Responses:**

**200 OK**

Login a user.
```json
{
  "message": "Login successful.",
}
```

**400 Bad Requests**

Validate input presence - email and password are required.
```json
{
  "message": "All fields are required."
}
````

Validate email format - email must be a valid email address.
```json
{
  "message": "Invalid email format."
}
```

**401 Unauthorized**

Validate that the user exists in the database based on email.
```json
{
  "message": "Invalid email or password."
}
```

**500 Internal Server Error**

Catch error in logging in user.
```json
{
  "message": "Internal server error - an error occured while logg in."
}
```
#### Logout a user
**Method:** POST

**Endpoint:** `/api/auth/logout`

**Request body:**
- No request body is required for this endpoint.

**Responses:**
**200 OK**

Logout a user.
```json
{
  "message": "Logout successful."
}
```
**400 Bad Request**

Checks if the JWT token exists.
```json
{
  "message": "No active session found."
}
```

**500 Internal Server Error**
Catch error in logging out user.
```json
{
  "message": "An error occured while logging out."
}
```

### Appointment management (for patients)
A user/admin must be logged in/authenticated to access the `/appointments` endpoints.

#### Fetch avaiable times slots for booking on a specific date
**Method:** GET

**Endpoint:** 
`/api/appointments/`
- Will fetch available time slots for today's date if no date is specified.
- Will only work on weekdays (Monday to Friday) between 08:00 and 14:30 (working schedule at Sandefjord legesenter).

OR

`/api/appointments?date=YYYY-MM-DD`
- Will fetch available time slots for the specified date if a date is specified in the parameters

**OPTIONAL - Request parameters:**
- Key: date
- Value: YYYY-MM-DD (e.g., 2024-12-04)

**Request body:**
- No request body is required for this endpoint.

**Responses:**
**200 OK**

Fetch available time slots for booking an appointment for a specified date.
```json
{
    "message": "Available timeslots fetched successfully",
    "doctorsWithAppointments": [
        {
            "doctor_id": 1,
            "doctor_name": "Dr. Carol White",
            "date": "2024-10-21",
            "available_slots": [
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30"
            ]
        },
        {
            "doctor_id": 2,
            "doctor_name": "Dr. Bob Smith",
            "date": "2024-10-21",
            "available_slots": [
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30"
            ]
        },
        {
            "doctor_id": 3,
            "doctor_name": "Dr. Alice Johnson",
            "date": "2024-10-21",
            "available_slots": [
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30"
            ]
        },
    ]
}
```
**400 Bad Request**

Check if the selected date is not in the past.
```json
{
  "message": "No appointments available for past dates."
}
```

Check if the selected date is not Saturday or Sunday.
```json
{
  "message": "No appointments available for the specified date."
}
```
**500 Internal Server Error**

Catch error in fetching available time slots.
```json
{
  "message": "Failed to get available time slots."
}
```

#### Book an appointment

**Method:** POST

**Endpoint:** `/api/appointments`

**Request body:**
```json
{
  "doctor_id": 1,
  "appointment_date": "2024-10-25",
  "start_time": "10:30"
}
```
- Where `appointment_date` can be anywhere from today's date to four weeks from today, and `start_time` can be any of the available time slots for the specified doctor for the specified date. 


**Responses:**

**201 Created**

Book an appointment.
```json
{
  "message": "Booking confirmed for Friday, 2024-10-25 at 10:30 with Dr. Carol White"
}
```
**400 Bad Request**

Validate input presence - doctor_id, appointment_date, and start_time are required.
```json
{
  "message": "All fields are required."
}
```

Check if the appointment date is not in the past.
```json
{
  "message": "Cannot book appointments for past dates."
}
```

Ensure that the appointment start time is at least one hour in the furutre.
```json
{
  "message": "Appointments must be booked at leadt one hour before the start time."
}
```

Validate that the appointment date is within the allowed booking window (four weeks from today's date).
```json
{
  "message": "Appointments can only be booked up to four weeks in advance."
}
```

Ensure that the appointment date is not on a Saturday or Sunday.
```json
{
  "message": "No appointments available for the specified date."
}
```

Check if the user has three or less furture appointments booked.
```json
{
  "message": "You can only have a maximum of three future appointments."
}
```

Verify if the selected time slot is available.
```json
{
  "message": "This timeslot is not available."
}
```

Check for conflicting appointments with other doctors at the same start time and date
```json
{
  "message": "You allready have an appointment booked with another doctor at this time."
}
````

Verify that the selected timeslot is not in the exeptions (not available) section for the selected doctor
```json
{
  "message": "The selected timeslot is not available."
}
```

**500 Internal Server Error**

Catch error in booking an appointment.
```json
{
  "message": "Failed to book appointment."
}
````

#### Change an existing appointment

**Method:** PUT

**Endpoint:** `/api/appointments/:appointmentId`
- Where `:appointmentsId` is the ID of the appointment to be changed.
- The appointment must be booked by the logged in user.

**Request body:**
```json
{
  "doctor_id": 2,
  "appointment_date": "2024-10-25",
  "start_time": "10:30"
}
````
- `doctor_id` must be the id of any of the other doctors than the one the appointment is currently booked with.
- `appointment_date` can be anywhere from today's date to four weeks from today.
- `start_time` can be any of the available time slots for the specified doctor for the specified date.

**Responses:**

**200 OK**
Change an existing appointment.
```json
{
    "message": "Appointment changed to Friday, 2024-10-25 at 10:30 with Dr. Dr. Bob Smith"
}
````

**400 Bad Request**

Validate input presence - doctor_id, appointment_date, and start_time are required.
```json
{
  "Message": "All fields are required."
}
```
  // Validate that the appointment time is within the working hours of the doctor and of valid start time (whole and half hours)
```json
{
  "Message": "Invalid appointment time."
}
```

Check if the selected date is not in the past.
```json
{
  "Message": "Choose today's date or a future date."
}
```

Ensure that the appointment start time is at least one hour in the furutre.
```json
{
  "Message": "Appointments must be booked at least one hour in advance."
}
```

Validate that the appointment date is within the allowed booking window (four weeks from today's date).
```json
{
  "Message": "Appointments can only be booked up to four weeks in advance."
}
```

Ensure that the appointment date is not on a Saturday or Sunday.
```json
{
  "Message": "No appointments available for the specified date."
}
```

Ensure that the appointment date, time and doctor id are not the same as the current ones.
```json
{
  "Message": "You have already booked this appointment with the same doctor, date and time."
}
```

Ensure that there is no conflicting appointments with other doctors at the same start time and date.
```json
{
  "Message": "You already have an appointment booked with another doctor at this time."
}
```

Check if the timeslot is not booked by another user.
```json
{
  "Message": "The selected timeslot is not available."
}
```

Verify that the selected timeslot is not in the exeptions (not available) section for the selected doctor.
```json
{
  "Message": "The selected timeslot is not available."
}
```

Verify that the selected appointment is not already booked on the same day and time and with the same doctor.
```json
{
  "Message": "You already have an appointment booked at this time with the same doctor."
}
```
**404 Not Found**

Check if the appointment exists and belongs to the user.
```json
{
  "Message": "Appointment not found."
}
```

Check if the doctor exists.
```json
{
  "Message": "Doctor not found."
}
```

**500 Internal Server Error**

Catch error in updating the appointment.
```json
{
  "Message": "Failed to update the appointment."
}
```

#### Delete an existing appointment
**Method:** DELETE

**Endpoint:** `/api/appointments/:appointmentId`
- Where `:appointmentsId` is the ID of the appointment to be deleted.
- The appointment must be booked by the logged in user.

**Request body:**
- No request body is required for this endpoint.

**Responses:**

**200 OK**

Delete an existing appointment.
```json
{
  "Message": "Appointment successfully cancelled."
}
```
**400 Bad Request**

Validate that the appointment to be deleted is not in the past.
```json
{
  "Message": "Cannnot cancel past appointments."
}
```

Check if the appointment is within the cancelation window (24 hours in advance).
```json
{
  "Message": "Appointments can only be cancelled at least 24 hours in advance."
}
```

Check if the appointment has status booked or updated.
```json
{
  "Message": "Only booked or updated appointments can be cancelled."
}
```


**404 Not Found**

Check if the appointment exists and belongs to the user.
```json
{
  "Message": "Appointment not found."
}
```
**500 Internal Server Error**

Catch error in deleting the appointment.
```json
{
  "Message": "Failed to cancel the appointment."
}
```
### Adminstration (for doctors office employees)
An user with admin role must be logged in and autheticated as both a user and an admin to access the `/admin` endpoints. The admin user is created manually by the database script when the database is created for the first time.

1. Log out from the current user using POST at the `/api/auth/logout` endpoint.
2. Log in using POST at the `/api/auth/login` endpoint with the following body:
```json
{
    "email": "admin@sandefjord.legesenter.no",
    "password": "adminpassword"
}
```

#### Fetch a list of doctors
**Method:** GET

**Endpoint:** `/api/admin/doctors`

**Request body:**
- No request body is required for this endpoint.

**Responses:**

**200 OK**

A list of doctors with their Id, names, specialisation and availability is returned.
```json
{
  "Message": "Doctors fetched successfully."
}
```
**404 Not Found**

Check if any doctors are found in the database.
```json
{
  "Message": "No doctors found."
}
```

**500 Internal Server Error**

Catch error in fetching doctors from the database.
```json
{
  "Message": "Failed to fetch doctors."
}
```

#### Add a new doctor
**Method:** POST

**Endpoint:** `/api/admin/doctors`

**Request body:**
```json
{
  "doctor_name": "Dr. Heidi Hem",
  "specialisation": "Pediatrics",
  "availability": {
    "weekly_schedule": {
      "Monday": [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
      ],
      "Tuesday": [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
      ],
      "Wednesday": [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
      ],
      "Thursday": [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
      ],
      "Friday": [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
      ]
    },
    "exceptions": {
      "2024-10-23": [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"
      ]
    }
  }
}
```
- Working hours are for the office is set from monday to friday, 08:00 - 11.30 and 12:00 - 15:30. 
- Start times for each time slot is are at whole and half hour intervals, lasting 30 minutes each. 
- Exeptions for specific date(s) and time slots can be added.

**Responses:**

**201 Created**

Add a new doctor to the database.
```json
{
  "Message": "Doctor added sucessfully."
}
```
**400 Bad Request**

Validate input presence - doctor name, specialisation and availability are required.
```json
{
  "Message": "All fields are required."
}
```

Validate unique doctor name.
```json
{
  "Message": "A doctor with the same name already exists."
}
```

**500 Internal Server Error**

Catch error in adding doctor to the database.
```json
{
  "Message": "Error adding doctor."
}
```
#### Update an existing doctor

**Method:** PUT

**Endpoint:** `/api/admin/doctors/:doctorId`
- Where `:doctorId` is the ID of the doctor to be updated.

**Request body:**
```json
{
  "availability": {
    "weekly_schedule": {
      "Monday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
      "Tuesday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
      "Wednesday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
      "Thursday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
      "Friday": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"]
    },
    "exceptions": {
      "2024-10-24": ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15.30"]
    }
  }
}
````
- Time slots can be added or removed from the weekly schedule
- Exeptions for specific date(s) and time slots can be added or removed
- Working hours are for the office is set from monday to friday, 08:00 - 11.30 and 12:00 - 15:30. 
- Start times for each time slot is are at whole and half hour intervals, lasting 30 minutes each. 

**Responses:**

**200 OK**

Update an existing doctor's availability.
```json
{
  "Message": "Doctor availability updated successfully."
}
```

**400 Bad Request**

Validate input presence - availability is required.
```json
{
  "Message": "Availability is required."
}
```
Validate availability is in the correct format (object).
```json
{
  "Message": "Invalid availability format."
}
```
**404 Not Found**

Check if the doctor exists in the database.
```json
{
  "Message": "Doctor not found."
}
```
**500 Internal Server Error**

Catch error in updating doctor availability.
```json
{
  "Message": "Error updating doctor availability."
}
```

#### Delete a doctor

**Method:** DELETE

**Endpoint:** `/api/admin/doctors/:doctorId`
- Where `:doctorId` is the ID of the doctor to be deleted.

**Body:**
- No request body is required for this endpoint.

**Responses:**
**200 OK**

Delete a doctor from the database.
```json
{
  "Message": "Doctor deleted successfully."
}
```

**404 Not Found**

Check if the doctor exists in the database.
```json
{
  "Message": "Doctor not found."
}
```

**500 Internal Server Error**

Catch error in deleting doctor.
```json
{
  "Message": "Error deleting doctor."
}
```

#### Fetch list of booked appointments

**Method:** GET

**Endpoint:** `/api/admin/appointments`

**Request body:**
- No request body is required for this endpoint.

**Responses:**
**200 OK**

Fetch a list of booked appointments.
```json
{
  "Message": "Appointments fetched successfully."
}
```

**500 Internal Server Error**

Catch error in fetching booked appointments.
```json
{
  "Message": "Failed to fetch booked appointments."
}
```

## Demo
- Demo video:
