const Job = require("../models/Job");

// Create a job
const createJob = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can post jobs"
            });
        }

        const { title, company, location, description, salary } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            recruiter: req.user.id
        });

        res.status(201).json({
            message: "Job posted successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to post job",
            error: error.message
        });
    }
};

// Get all jobs
// Get all jobs with search, location filter and pagination
const getJobs = async (req, res) => {
    try {
        const { search, location, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ];
        }

        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalJobs = await Job.countDocuments(filter);

        res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            totalJobs,
            currentPage: Number(page),
            totalPages: Math.ceil(totalJobs / Number(limit))
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};

// Update a job
const updateJob = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can edit jobs"
            });
        }

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot edit this job"
            });
        }

        const { title, company, location, description, salary } = req.body;

        if (title !== undefined) job.title = title;
        if (company !== undefined) job.company = company;
        if (location !== undefined) job.location = location;
        if (description !== undefined) job.description = description;
        if (salary !== undefined) job.salary = salary;

        await job.save();

        res.status(200).json({
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update job",
            error: error.message
        });
    }
};

module.exports = {
    createJob,
    getJobs,
    updateJob
};