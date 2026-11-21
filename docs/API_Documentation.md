CareerConnect – API Documentation

1. Project Overview

CareerConnect is a Job Application Management Platform developed using Node.js, Express.js and MongoDB.

It allows candidates to create profiles, search for jobs, upload resumes and apply for jobs. Recruiters can create and manage job listings, maintain company profiles and manage applications.

2. Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Multer
- bcryptjs

3. Base URL

"http://localhost:5000"

4. Authentication

The application uses JWT authentication.

For protected APIs, include this header:

"Authorization: Bearer <JWT_TOKEN>"

Users can register and log in using the authentication APIs.

Register User

- Method: POST
- Endpoint: "/api/auth/register"
- Access: Public

Request body:

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123456",
  "role": "jobseeker"
}

Login User

- Method: POST
- Endpoint: "/api/auth/login"
- Access: Public

Request body:

{
  "email": "test@example.com",
  "password": "Test123456"
}

Returns an authentication token after successful login.

5. Candidate Profile APIs

Get Candidate Profile

- Method: GET
- Endpoint: "/api/users/profile"
- Access: Authenticated user

Returns the user's profile information.

Update Candidate Profile

- Method: PUT
- Endpoint: "/api/users/profile"
- Access: Job seeker

Request body:

{
  "phone": "9876543210",
  "skills": ["HTML", "CSS", "JavaScript"],
  "education": "BCS",
  "bio": "Computer science student."
}

6. Company Profile API

Update Company Profile

- Method: PUT
- Endpoint: "/api/users/company-profile"
- Access: Recruiter

Request body:

{
  "companyName": "ABC Technologies",
  "companyDescription": "Software development company.",
  "companyWebsite": "https://example.com",
  "companyLocation": "Pune"
}

7. Job Management APIs

Create Job

- Method: POST
- Endpoint: "/api/jobs"
- Access: Recruiter

Request body:

{
  "title": "Frontend Developer",
  "company": "ABC Technologies",
  "location": "Pune",
  "description": "Frontend development role.",
  "salary": 25000
}

Get All Jobs

- Method: GET
- Endpoint: "/api/jobs"
- Access: Public

Optional query parameters:

- "search": Search by job title or company.
- "location": Filter jobs by location.
- "page": Page number.
- "limit": Number of jobs per page.

Example:

"/api/jobs?search=developer&location=Pune&page=1&limit=10"

Update Job

- Method: PUT
- Endpoint: "/api/jobs/:jobId"
- Access: Job-owning recruiter

Allows recruiters to update their job listings.

8. Job Application APIs

Apply for a Job

- Method: POST
- Endpoint: "/api/applications/:jobId"
- Access: Job seeker
- Content type: "multipart/form-data"

Form fields:

- "resume": PDF resume file (maximum 5 MB).
- "coverLetter": Cover letter text.

Get My Applications

- Method: GET
- Endpoint: "/api/applications/my-applications"
- Access: Job seeker

Returns applications submitted by the logged-in candidate.

Get Received Applications

- Method: GET
- Endpoint: "/api/applications"
- Access: Recruiter

Returns applications received by the logged-in recruiter.

Update Application Status

- Method: PUT
- Endpoint: "/api/applications/:applicationId/status"
- Access: Recruiter

Request body:

{
  "status": "accepted"
}

Available statuses:

- pending
- accepted
- rejected

9. Resume Upload

The application uses Multer for resume file uploads.

- Only PDF files are accepted.
- Maximum file size is 5 MB.
- Files are stored in the "uploads" folder.
- A unique filename is generated for each uploaded file.
- The resume file path is stored with the job application in MongoDB.

10. Database Models

The application uses three main MongoDB models:

User

Stores user details, authentication information, candidate profile information and company profile information.

Job

Stores job title, company, location, description, salary and recruiter information.

Application

Stores job reference, applicant reference, resume path, cover letter and application status.

11. Security Features

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based authorization.
- Protected API routes.
- Resume file type validation.
- Resume file size restriction.
- Prevention of duplicate job applications.

12. Conclusion

CareerConnect provides a backend system for managing job listings and job applications. It supports candidates and recruiters through authentication, profile management, job management, resume uploads and application tracking.