const Company = require("../models/company");
const Candidate = require("../models/candidate");
const Job = require("../models/job");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    const companiesWithLinks = companies.map((company) => {
      const id = company._id;
      return {
        ...company._doc,
        links: [
          {
            rel: "self",
            href: `${req.baseUrl}/${id}`,
          },
          {
            rel: "company-jobs",
            href: `${req.baseUrl}/${id}/jobs`,
          },
        ],
      };
    });

    res.json(companiesWithLinks);
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
    // Check if the UID is already associated with an existing Company or User
    const existingCompany = await Company.findOne({ userId: req.user.uid });
    const existingCandidate = await Candidate.findOne({ userId: req.user.uid });
    if (existingCompany || existingCandidate) {
      return res.status(400).json({
        error:
          "UID is already associated with an existing Company or Candidate",
      });
    }

    const newCompany = new Company({
      ...req.body,
      userId: req.user.uid,
    });

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
    const companyData = req.company;
    if (!companyData || !companyData._id) {
      return res.status(404).json({ message: "Company not found" });
    }
    const result = await Company.deleteOne({ _id: companyData._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    res
      .status(200)
      .json({ message: `Deleted company with ID: ${companyData._id}` });
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
    const companyId = req.company._id;

    if (!companyId) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updateFields = req.body;

    // Using findByIdAndUpdate for direct update
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateFields,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(updatedCompany);
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
    const companyId = req.company._id;
    if (!companyId) {
      return res.status(404).json({ message: "Company not found" });
    }
    const updateFields = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateFields,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(updatedCompany);
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
    const company = req.company;
    const id = company._id;
    //HATEOAS
    company._doc.links = [
      {
        rel: "self",
        href: `${req.baseUrl}/${id}`,
      },
      {
        rel: "company-jobs",
        href: `${req.baseUrl}/${id}/jobs`,
      },
    ];

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

const getAllCompanyJobs = async (req, res) => {
  try {
    console.log("Here");
    const companyId = req.params.id;
    const company = await Company.findById(companyId).populate("jobs");
    if (!company) return res.status(404).send("Company not found");
    res.send(company.jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCompanyJob = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, companyId: id });
    if (!job)
      return res.status(404).send("Job not found for the specified company");
    res.send(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  deleteOneCompany,
  updateCompany,
  updatePartOfCompany,
  getCompany,
  getAllCompanyJobs,
  getCompanyJob,
};
