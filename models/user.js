const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["jobseeker", "recruiter"],
        default: "jobseeker"
    },
    
    phone: {
    type: String
},

skills: {
    type: [String],
    default: []
},

education: {
    type: String
},

bio: {
    type: String
},
companyName: { type: String },
companyDescription: { type: String },
companyWebsite: { type: String },
companyLocation: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
