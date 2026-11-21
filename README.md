CareerConnect – Job Application Management Platform

1. Project Overview

CareerConnect is a web-based Job Application Management Platform developed using Node.js, Express.js and MongoDB.

The platform connects job seekers with recruiters. Candidates can search for jobs, create profiles, upload resumes and apply for jobs. Recruiters can create job listings, manage company profiles and track applications.

2. Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS
- JavaScript
- JSON Web Token (JWT)
- Multer
- bcryptjs

3. Main Features

User Authentication

- User registration and login.
- Password hashing.
- JWT-based authentication.

Candidate Management

- Create and update candidate profiles.
- Add skills, education, phone number and bio.

Company Management

- Update company name.
- Add company description.
- Add company website and location.

Job Management

- Recruiters can create jobs.
- Recruiters can edit their job listings.
- Candidates can view available jobs.

Job Search

- Search jobs by title or company.
- Filter jobs by location.
- Pagination support.

Job Applications

- Candidates can apply for jobs.
- Upload PDF resumes.
- Add cover letters.
- View submitted applications.
- Recruiters can view received applications.
- Recruiters can update application status.

4. Project Folder Structure

job-application-platform/
│
├── config/
│   ├── db.js
│   └── upload.js
│
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   └── applicationController.js
│
├── docs/
│   ├── API_Documentation.md
│   └── Database_Schema.md
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Job.js
│   └── Application.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── jobRoutes.js
│   └── applicationRoutes.js
│
├── uploads/
├── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json

5. Installation and Setup

Step 1: Install Node.js

Install Node.js on your computer.

Step 2: Install Dependencies

Open the project folder in the terminal and run:

npm install

Step 3: Configure Environment Variables

Create a ".env" file in the main project folder.

Add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Replace the example values with your own private configuration.

Step 4: Start the Server

Run:

npm run dev

Step 5: Open the Application

Open the following address in your browser:

"http://localhost:5000"

6. Resume Upload

The platform uses Multer for PDF resume uploads.

- Accepted format: PDF
- Maximum file size: 5 MB
- Uploaded files are stored in the uploads folder.
- Resume file paths are saved in MongoDB with applications.

7. Security

- Passwords are hashed using bcryptjs.
- JWT authentication protects restricted routes.
- Role-based authorization separates candidate and recruiter permissions.
- Resume uploads have file type and size restrictions.
- Duplicate job applications are prevented.

8. Documentation

Additional project documentation is available in the "docs" folder:

- API_Documentation.md
- Database_Schema.md

9. Conclusion

CareerConnect provides a simple and effective platform for job management and recruitment. It helps candidates apply for jobs and allows recruiters to manage job listings and applications through a centralized system.