const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply for a job
const applyForJob = async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                message: "Only job seekers can apply"
            });
        }

        const resume = req.file ? req.file.path : req.body.resume;
const { coverLetter } = req.body;
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resume,
            coverLetter
        });

        res.status(201).json({
            message: "Job application submitted successfully",
            application
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        res.status(500).json({
            message: "Application failed",
            error: error.message
        });
    }
};

// View applications for a recruiter's jobs
const getApplications = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can view applications"
            });
        }

        const jobs = await Job.find({
            recruiter: req.user.id
        }).select("_id");

        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate("job", "title company")
            .populate("applicant", "name email");

        res.status(200).json({
            message: "Applications fetched successfully",
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};
// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can update applications"
            });
        }

        const { status } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findById(
            req.params.applicationId
        ).populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (application.job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot update this application"
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update application status",
            error: error.message
        });
    }
};
// Job seeker views their own applications
const getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                message: "Only job seekers can view their applications"
            });
        }

        const applications = await Application.find({
            applicant: req.user.id
        })
        .populate("job", "title company location salary")
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your applications fetched successfully",
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your applications",
            error: error.message
        });
    }
};

module.exports = { applyForJob, getApplications,updateApplicationStatus,getMyApplications };