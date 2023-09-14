const application = require('../models/application');
const Application = require('../models/application');
const Jobs = require('../models/jobs');

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const { sort, order, application_num } = req.query;
    let applications = await Application.find();

    //filtering
    if (application_num) {
      applications = await Application.find({ application_num });
    }

    //sorting 
    if (sort && order) {
      applications = await Application.find().sort({ [sort]: order });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Create an application
const createApplication = async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Delete all applications
const deleteAllApplications = async (req, res) => {
  try {
    const result = await Application.deleteMany();
    if (result.deletedCount > 0) {
      res.status(200).json('All applications were deleted.');
    } else {
      res.status(404).json('There are no applications found.');
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Get a specific application 
const getApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const application = await Application.findById(id);
    res.json(application);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Update a specific application
const updateApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const application = await Application.findById(id);
    application.application_num = req.body.application_num;
    application.questions = req.body.questions;
    application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Update a part of application 
const updatePartOfApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    const application = await Application.findByIdAndUpdate(id, updateFields, { new: true });
    if (!application) {
      return res.status(404).json('Application not found');
    }
    res.json(application);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Delete a specific application
const deleteOneApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const application = await Application.findOneAndRemove(id);
    res.status(200).json(`Deleted ${application}`);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

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
    const aplicationId = req.params.application_id;
    const job = await Jobs.findById(jobId);
    if (!job) {
      return res.status(404).json('Job is not found.');
    }
    await Jobs.updateOne(
      { _id: jobId, },
      { $pull: { applications: { _id: aplicationId } } }
    );
    res.status(200).json(job.applications);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getAllApplications,
  createApplication,
  deleteAllApplications,
  getApplication,
  updateApplication,
  updatePartOfApplication,
  deleteOneApplication,
  postApplicationsForJobs,
  getApplicationsForJobs,
  getOneApplicationForJob,
  deleteOneApplicationForJob
};