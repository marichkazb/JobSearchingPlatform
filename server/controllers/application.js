const Application = require('../models/application');

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json(error);
    }
  };

  const createApplication = async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.status(201).json(newApplication);
      } catch (error) {
        res.status(500).json(error);
      }
  };

  module.exports = {
    getAllApplications,
    createApplication
  };
