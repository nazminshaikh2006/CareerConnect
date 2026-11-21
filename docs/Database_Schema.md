CareerConnect – Database Schema Documentation

1. Introduction

CareerConnect uses MongoDB as its database and Mongoose to define and manage database models.

The application contains three main collections:

1. Users
2. Jobs
3. Applications

2. User Collection

The User collection stores candidate and recruiter information.

Field| Data Type| Description
name| String| User's name
email| String| User's email address
password| String| Hashed password
role| String| jobseeker or recruiter
phone| String| Contact number
skills| Array of Strings| Candidate skills
education| String| Educational qualification
bio| String| User biography
companyName| String| Company name
companyDescription| String| Company description
companyWebsite| String| Company website
companyLocation| String| Company location
createdAt| Date| Account creation date
updatedAt| Date| Last update date

3. Job Collection

The Job collection stores job listings created by recruiters.

Field| Data Type| Description
title| String| Job title
company| String| Company name
location| String| Job location
description| String| Job description
salary| Number| Salary offered
recruiter| ObjectId| Reference to User
createdAt| Date| Job creation date
updatedAt| Date| Last update date

4. Application Collection

The Application collection stores candidate applications.

Field| Data Type| Description
job| ObjectId| Reference to Job
applicant| ObjectId| Reference to User
resume| String| Uploaded resume file path
coverLetter| String| Candidate cover letter
status| String| pending, accepted or rejected
createdAt| Date| Application creation date
updatedAt| Date| Last update date

5. Database Relationships

- One recruiter can create multiple jobs.
- One job can receive applications from multiple candidates.
- One candidate can apply for multiple jobs.
- Each application belongs to one candidate and one job.

6. Data Validation and Constraints

- Email is used for user identification.
- User roles are restricted to jobseeker and recruiter.
- Application status is restricted to pending, accepted and rejected.
- Duplicate applications for the same job by the same candidate are prevented using a unique compound index.
- Mongoose references connect users, jobs and applications.

7. Conclusion

The CareerConnect database is designed to manage users, job listings and job applications efficiently using MongoDB and Mongoose.