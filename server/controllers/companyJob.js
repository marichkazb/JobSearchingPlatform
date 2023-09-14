const Company = require("../models/company");
const Job = require("../models/job");

const getAllCompanyJobs = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId).populate("jobs");
    if (!company) return res.status(404).send("Company not found");
    res.send(company.jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCompanyJob = async (req, res) => {
  try {
    const { companyId, jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, companyId: companyId });
    if (!job)
      return res.status(404).send("Job not found for the specified company");
    res.send(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllCompanyJobs,
  getCompanyJob,
};