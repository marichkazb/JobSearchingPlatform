const Company = require("../models/company");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const createCompany = async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const deleteOneCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findOneAndRemove({ _id: id });
    res.status(200).json(`Deleted ${company}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    company.name = req.body.name;
    company.email = req.body.email;
    company.logo = req.body.logo;
    company.locations = req.body.locations;

    company.save();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const updatePartOfCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    const company = await Company.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const getCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  deleteOneCompany,
  updateCompany,
  updatePartOfCompany,
  getCompany,
};
