# Car Parking App

## Overview

Welcome to the Car Parking App documentation! This REST API is designed to manage parking zones, user registrations, and car listings. It provides a range of endpoints for user registration, authentication, password reset, car listing, parking zone management, and booking.
Car Parking App is a backend application built using Node.js and Express.js, with data storage handled by a MySQL database. It is designed to simplify the process of managing parking zones, allowing users to register their cars, book parking spots, and more.

## Getting Started

### Prerequisites

Before you start using the Car Parking App, ensure you have the following:

1. **Node.js**: Make sure you have Node.js installed on your system. You can download it [here](https://nodejs.org/).

2. **Git**: You'll need Git to clone the project repository. You can download it [here](https://git-scm.com/).

3 **Create a .env file in the project root with the following fields:**
| Variable Name | Description |
|--------------------|----------------------------|
| `PORT` | Port for your application |
| `JWT_SECRET` | Secret key for JWT |
| `MYSQL_HOST` | MySQL database host |
| `MYSQL_USER` | MySQL database user |
| `MYSQL_PASSWORD` | MySQL database password |
| `MYSQL_DATABASE` | MySQL database name |
| `ADMIN_USERNAME` | Admin username |
| `ADMIN_PASSWORD` | Admin password |
| `ADMIN_EMAIL` | Admin email address |
| `EMAIL_PROVIDER` | Email provider (e.g., SMTP)|
| `MY_EMAIL` | Your email address |
| `MY_EMAIL_PASSWORD`| Your email password |
| `SENDER_EMAIL` | Sender email address |

Make sure to replace the values with your specific configuration.

### Installation

Follow these steps to set up the project:

- Clone this repository to your local machine.

- CD into the project directory.

- Run npm i to install the project dependencies.
- Run npm run dev to start the server.

### Usage

Authentication
Car Parking App uses JWT-based authentication. To access protected endpoints, include a valid JWT token in the **Authorization** header of your requests.

Protect Middleware
The **protect** middleware ensures that only authenticated users can perform certain actions. For example, you must be logged in to add a car to a parking zone.

PermissionTo Middleware
The **permissionTo** middleware restricts privileged actions to administrators. To gain admin privileges, run the createAdmin.js script with Node.js:
<br>
`node createAdmin.js`

### Endpoints

**Users**

- ` POST /api/v1/users/signup`: Register a new user.
- `POST /api/v1/users/login`: Authenticate a user.
- `GET /api/v1/users/login`: get all users
- `DELETE /api/v1/users/login`: delete a user with id.
- `GET /api/v1/users/login`: get one user with id.
- `POST /api/v1/users/request-reset`: Request a password reset.
- `POST /api/v1/users/reset-password`: Reset a user's password.

**Cars**

- `GET /api/v1/cars/carlist`: List cars for the logged-in user.
- `POST /api/v1/cars/carlist`: add cars for the logged-in user you need to specify parking zone id as well.
- `DELETE /api/v1/cars/carlist`: delete cars for the logged-in user.
- `PATCH /api/v1/cars/carlist`: update car info for the logged-in user.

**Parking Zones**

- `GET /api/v1/parking`: see all the parking zones (for admin)
- `POST /api/v1/parking`: create parking zones (for admin)
- `GET /api/v1/parking`: delete a parking zone with id (for admin)

**Bookings**

- `/api/v1/bookings`: View and manage booking history (for logged in user).

### other

**view Mysql database design** in `mysql files`

### Dependencies

This project uses the following dependencies

- `express`
- `mysql2`
- `nodemon`
- `nodemailer`
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `dotenv`
