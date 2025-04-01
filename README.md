# Documentation

## 1. Introduction

### a. Overview

This is a backend application designed to manage user data and send scheduled notifications, such as birthday greetings. It provides the following key features:

- User registration and profile management
- Scheduled tasks for sending birthday notifications.
- Integration for email notifications.
- Timezone-aware scheduling and user management.

### b. Some tech stacks

- **Node.js**: Runtime environment for building the backend.
- **Express.js**: Web framework for handling HTTP requests and routing.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: ODM for MongoDB.
- **Agenda.js**: Job scheduling library for managing scheduled tasks.
- **Nodemailer**: Library for sending emails.

## 2. Getting Started

### a. Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local or remote instance)
- **Docker** (optional, for containerized deployment)

### b. Clone the repo

```bash
git clone git@github.com:geraldabrhm/sentbe-scheduler.git
cd sentbe-scheduler
```

### c. Configuration

Before starting the application, configure the environment variables. Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URI=<your_mongodb_connection_string>
EMAIL_HOST=<your_email_host>
EMAIL_PORT=<your_email_port>
EMAIL_USER=<your_email_username>
EMAIL_PASS=<your_email_password>
```

Replace the placeholders with your actual configuration values.

### d. Running the Application

To start the application, follow these steps:

1. Install dependencies:

```bash
npm install
```

2. Start the application:

```bash
npm run dev:local
```

3. For development mode with live reload:

The application will be accessible at `http://localhost:3000` by default.

### e. Run unit testing

Run the test suite to ensure everything is working correctly:

```bash
npm run test:unit
```

### f. Docker Deployment (Optional)

To deploy the application using Docker:

1. Build the Docker image:

```bash
docker build -t sentbe-scheduler .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env sentbe-scheduler
```

The application will now be running in a containerized environment.
