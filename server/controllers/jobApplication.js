const Application = require('../models/application');
const Jobs = require('../models/job');

// Post a specific application for a job
const postApplicationsForJobs = async (req, res) => {
    try {
        const jobId = req.params.job_id;
        const applicationData = req.body;
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json('Job is not found.');
        }
        const application = new Application({ ...applicationData, jobId });
        job.applications.push(application);
        await job.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// Get all applications associated with a job
const getApplicationsForJobs = async (req, res) => {
    try {
        const jobId = req.params.job_id;
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json('Job is not found.');
        }
        res.status(200).json(job.applications);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// Retrieve the details of one job application
const getOneApplicationForJob = async (req, res) => {
    try {
        const jobId = req.params.job_id;
        const applicationId = req.params.application_id;
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json('Job is not found.');
        }
        const application = job.applications.find(item => item._id == applicationId);;
        if (!application) {
            return res.status(404).json('Application not found');
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// Delete an application for a job
const deleteOneApplicationForJob = async (req, res) => {
    try {
        const jobId = req.params.job_id;
        const applicationId = req.params.application_id;
        const job = await Jobs.findById(jobId);
        if (!job) {
            return res.status(404).json('Job is not found.');
        }
        job.applications = job.applications.filter(
            application => application._id.toString() !== applicationId);
        await job.save();
        res.status(200).json('Application is deleted');
    } catch (error) {
        res.status(500).json(error.message);
    }
};


module.exports = {
    postApplicationsForJobs,
    getApplicationsForJobs,
    getOneApplicationForJob,
    deleteOneApplicationForJob
};