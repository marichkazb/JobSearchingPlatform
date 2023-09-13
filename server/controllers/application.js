const Application = require('../models/application');

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json(error.message);
    }
  };

  const createApplication = async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.status(201).json(newApplication);
      } catch (error) {
        res.status(500).json(error.message);
      }
  };

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

  const getApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await Application.findById(id);
        res.json(application);
    } catch (error) {
        res.status(500).json(error.message);
    }
  };

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

  const deleteOneApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await Application.findOneAndRemove(id);
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
    updatePartOfApplication,
    deleteOneApplication
  };
