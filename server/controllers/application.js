const Application = require("../models/application");

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const { sort, order, status } = req.query;
    let applications = await Application.find();

    //filtering
    if (status) {
      applications = await Application.find({ status });
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

const createApplication = async (req, res) => {
  try {
    // Check if the body contains an array of applications
    if (Array.isArray(req.body)) {
      const applicationsData = req.body;

      const applicationsWithUserId = applicationsData.map((application) => ({
        ...application,
        candidateId: req.candidate._id,
      }));

      const insertedApplications = await Application.insertMany(
        applicationsWithUserId
      );
      return res.status(201).json(insertedApplications);
    } else {
      // Handle a single application object
      const newApplication = new Application({
        ...req.body,
        candidateId: req.candidate._id,
      });

      await newApplication.save();
      return res.status(201).json(newApplication);
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Delete all applications
const deleteAllApplications = async (req, res) => {
  try {
    const result = await Application.deleteMany();
    if (result.deletedCount > 0) {
      res.status(200).json("All applications were deleted.");
    } else {
      res.status(404).json("There are no applications found.");
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

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Update application
const updateApplication = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    const application = await Application.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!application) {
      return res.status(404).json("Application not found");
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

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(`Deleted ${application}`);
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
  deleteOneApplication,
};
