const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/upload");

const {
    applyForJob,
    getApplications,
    updateApplicationStatus,
    getMyApplications
} = require("../controllers/applicationController");

// Job seeker applies for a job
router.post("/:jobId", authMiddleware, upload.single("resume"), applyForJob);

// Job seeker views their own applications
router.get("/my-applications", authMiddleware, getMyApplications);

// Recruiter views received applications
router.get("/", authMiddleware, getApplications);

// Recruiter updates application status
router.put("/:applicationId/status", authMiddleware, updateApplicationStatus);

module.exports = router;