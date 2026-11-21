 const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// View user profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User profile accessed successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});

// Update candidate profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                message: "Only candidates can update this profile"
            });
        }

        const { phone, skills, education, bio } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { phone, skills, education, bio },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Candidate profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
});
// Update company profile
router.put("/company-profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can update company profiles"
            });
        }

        const {
            companyName,
            companyDescription,
            companyWebsite,
            companyLocation
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                companyName,
                companyDescription,
                companyWebsite,
                companyLocation
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Recruiter not found"
            });
        }

        res.status(200).json({
            message: "Company profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update company profile",
            error: error.message
        });
    }
});

module.exports = router;