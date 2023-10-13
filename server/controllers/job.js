const Job = require("../models/job");
const Application = require("../models/application");

// Create a job offering (Create)
const createJob = async (req, res) => {
  try {
    let createdJobs;

    if (Array.isArray(req.body)) {
      // If req.body is an array, then map through each object and add the companyId
      const jobs = req.body.map((job) => ({
        ...job,
        companyId: req.company._id,
      }));

      // Use the insertMany method from Mongoose to insert multiple documents into the collection.
      createdJobs = await Job.insertMany(jobs);
    } else {
      const job = await Job.create({
        ...req.body,
        companyId: req.company._id,
      });
      createdJobs = job;
    }

    res.status(201).json(createdJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

//Get all job offerings (Read)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

//Get a specific job offering (Read)
const getJobByID = async (req, res) => {
  try {
    const jobID = req.params.id;
    const job = await Job.findById(jobID);
    if (!job) {
      return res.status(404).send("Job not found.");
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

//Update a specific job offering (Update)
const updateJobByID = async (req, res) => {
  try {
    const jobID = req.params.id;
    const updateData = req.body;
    const updatedJob = await Job.findByIdAndUpdate(jobID, updateData, {
      new: true,
    });
    if (!updatedJob) {
      return res.status(404).send("Job not found.");
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

//Delete a specific job offering (Delete)
const deleteJobByID = async (req, res) => {
  try {
    const jobID = req.params.id;
    const deletedJob = await Job.findByIdAndRemove(jobID);
    if (!deletedJob) {
      return res.status(404).send("Job not found.");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json();
  }
};

//Delete all jobs (Delete)
const deleteAllJobs = async (req, res) => {
  try {
    const deleteAllJobs = await Job.deleteMany({});
    if (deleteAllJobs.deletedCount == 0) {
      return res.status(404).send("No jobs found to delete.");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const postApplicationsForJobs = async (req, res) => {
  try {
    // Check if the body contains an array of applications
    const id = req.params.id;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json("Specific job was not found.");
    }

    if (Array.isArray(req.body)) {
      const applicationsData = req.body;

      const applicationsWithUserId = applicationsData.map((application) => ({
        ...application,
        candidateId: req.candidate._id,
        jobId: job._id,
      }));
      job.applications.push(applicationsWithUserId);
      await job.save();
      const insertedApplications = await Application.insertMany(
        applicationsWithUserId
      );
      return res.status(201).json(insertedApplications);
    } else {
      // Handle a single application object
      const newApplication = new Application({
        ...req.body,
        candidateId: req.candidate._id,
        jobId: job._id,
      });
      job.applications.push(newApplication);
      await job.save();
      await newApplication.save();
      return res.status(201).json(newApplication);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getApplicationsForJobs = async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id).populate("applications");
    if (!job) {
      return res.status(404).json("Job is not found.");
    }
    res.status(200).json(job.applications);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Retrieve the details of one job application
const getOneApplicationForJob = async (req, res) => {
  try {
    const id = req.params.id;
    const applicationId = req.params.applicationId;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json("Job is not found.");
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json("Application not found");
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Delete an application for a job
const deleteOneApplicationForJob = async (req, res) => {
  try {
    const id = req.params.id;
    const applicationId = req.params.applicationId;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json("Job is not found.");
    }

    const application = Application.findById(applicationId);

    if (!application) {
      return res.status(404).json("Application not found");
    }

    // Delete the reference to the application within the job
    job.applications = job.applications.filter(
      (application) => application._id.toString() !== applicationId
    );
    await job.save();

    // Delete the actual application using the Application model
    await Application.findByIdAndRemove(applicationId);

    res.status(200).json("Application is deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobByID,
  updateJobByID,
  deleteJobByID,
  deleteAllJobs,
  postApplicationsForJobs,
  getApplicationsForJobs,
  getOneApplicationForJob,
  deleteOneApplicationForJob,
};
