let token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user") || "null");
let selectedJobId = null;

const message = document.getElementById("message");

function showMessage(text, success = true) {
    message.textContent = text;
    message.style.color = success ? "green" : "red";
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function updatePage() {
    const loggedIn = Boolean(token && user);

    document.getElementById("authSection").classList.toggle("hidden", loggedIn);
    document.getElementById("logoutBtn").classList.toggle("hidden", !loggedIn);

    document.getElementById("welcome").textContent =
        loggedIn ? "Welcome, " + user.name : "";

    document.getElementById("recruiterSection").classList.toggle(
        "hidden",
        !loggedIn || user.role !== "recruiter"
    );
    document.getElementById("myApplicationsSection").classList.toggle(
    "hidden",
    !loggedIn || user.role !== "jobseeker"
    );
}
async function loadMyApplications() {
    try {
        const response = await fetch("/api/applications/my-applications", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not load applications");
        }

        const list = document.getElementById("myApplicationsList");

        if (!data.applications || data.applications.length === 0) {
            list.innerHTML = "<p>You haven't applied for any jobs yet.</p>";
            return;
        }

        list.innerHTML = data.applications.map(application => `
            <div class="application-card">
                <h3>${escapeHTML(application.job?.title || "Job")}</h3>
                <p>Company: ${escapeHTML(application.job?.company || "")}</p>
                <p>Location: ${escapeHTML(application.job?.location || "")}</p>
                <p>Status: <strong class="status ${escapeHTML(application.status)}">${escapeHTML(application.status)}</strong></p>
            </div>
        `).join("");

    } catch (error) {
        showMessage(error.message, false);
    }
}

async function loadJobs() {
    const search = document.getElementById("searchInput").value;
    const location = document.getElementById("locationInput").value;

    try {
        const response = await fetch(
            `/api/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        const jobsList = document.getElementById("jobsList");

        jobsList.innerHTML = "";

        data.jobs.forEach(job => {
            jobsList.innerHTML += `
                <div class="job-card">
                    <h3>${escapeHTML(job.title)}</h3>
                    <p>Company: ${escapeHTML(job.company)}</p>
                    <p>Location: ${escapeHTML(job.location)}</p>
                    <p>Description: ${escapeHTML(job.description)}</p>
                    <p>Salary: ${escapeHTML(job.salary)}</p>
                    <button onclick="showApplyForm('${job._id}')">
                        Apply Now
                    </button>
                </div>
            `;
        });

        if (data.jobs.length === 0) {
            jobsList.innerHTML = "<p>No jobs found.</p>";
        }

    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// Register
document.getElementById("registerForm").addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        showMessage("Registration successful! Please login.");
        event.target.reset();

    } catch (error) {
        showMessage(error.message, false);
    }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        token = data.token;
        user = data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        event.target.reset();
        updatePage();
        await loadJobs();

        if (user.role === "recruiter") {
            await loadApplications();
        }else{
            await loadMyApplications();
        }

        showMessage("Login successful!");

    } catch (error) {
        showMessage(error.message, false);
    }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    token = null;
    user = null;

    document.getElementById("applySection").classList.add("hidden");
    updatePage();
    loadJobs();

    showMessage("Logged out successfully.");
});

// Show application form when a job seeker clicks Apply
document.getElementById("jobsList").addEventListener("click", event => {
    const button = event.target.closest(".apply-btn");

    if (!button) return;

    selectedJobId = button.dataset.id;
    document.getElementById("applySection").classList.remove("hidden");
    document.getElementById("applySection").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("cancelApply").addEventListener("click", () => {
    document.getElementById("applySection").classList.add("hidden");
});

// Apply for a job
document.getElementById("applyForm").addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/applications/" + encodeURIComponent(selectedJobId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Application failed");
        }

        showMessage("Application submitted successfully!");
        event.target.reset();
        document.getElementById("applySection").classList.add("hidden");

    } catch (error) {
        showMessage(error.message, false);
    }
});

// Recruiter posts a job
document.getElementById("jobForm").addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not post job");
        }

        showMessage("Job posted successfully!");
        event.target.reset();
        await loadJobs();

    } catch (error) {
        showMessage(error.message, false);
    }
});

// Recruiter views applications
async function loadApplications() {
    try {
        const response = await fetch("/api/applications", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not load applications");
        }

        const list = document.getElementById("applicationsList");

        if (!data.applications || data.applications.length === 0) {
            list.innerHTML = "<p>No applications received yet.</p>";
            return;
        }

        list.innerHTML = data.applications.map(application => `
            <div class="application-card">
                <h3>${escapeHTML(application.applicant?.name || "Applicant")}</h3>
                <p>Email: ${escapeHTML(application.applicant?.email || "")}</p>
                <p>Job: ${escapeHTML(application.job?.title || "")}</p>
                <p>Status: <strong>${escapeHTML(application.status)}</strong></p>

                <button data-application="${escapeHTML(application._id)}"
                        data-status="accepted">Accept</button>

                <button data-application="${escapeHTML(application._id)}"
                        data-status="rejected">Reject</button>
            </div>
        `).join("");

    } catch (error) {
        showMessage(error.message, false);
    }
}

// Recruiter accepts or rejects an application
document.getElementById("applicationsList").addEventListener("click", async event => {
    const button = event.target.closest("button[data-application]");

    if (!button) return;

    const applicationId = button.dataset.application;
    const status = button.dataset.status;

    try {
        const response = await fetch(
            "/api/applications/" + encodeURIComponent(applicationId) + "/status",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ status })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not update application");
        }

        showMessage("Application " + status + " successfully!");
        await loadApplications();

    } catch (error) {
        showMessage(error.message, false);
    }
});

// Start the page
updatePage();
loadJobs();

if (user && user.role === "recruiter") {
    loadApplications();
} 
if (user && user.role === "jobseeker") {
    loadMyApplication();
}