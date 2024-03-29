const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  getAllCompanies,
  createCompany,
  getCompany,
  deleteOneCompany,
  updateCompany,
  updatePartOfCompany,
  getAllCompanyJobs,
  getCompanyJob,
  postCompanyJob,
  deleteOneJobInCompany
} = require("../controllers/company");
const { verifyCompanyOwnership } = require("../authMiddleware");

router.get("/:id/jobs", getAllCompanyJobs);
router.get("/:id/jobs/:jobId", getCompanyJob);
router.post("/:id/jobs", postCompanyJob);
router.delete("/:id/jobs/:jobId", deleteOneJobInCompany)

router.get("/", getAllCompanies);
router.get("/:id", getCompany);
router.post("/", createCompany);

router.delete("/:id", verifyCompanyOwnership, deleteOneCompany);
router.put("/:id", verifyCompanyOwnership, updateCompany);
router.patch("/:id", verifyCompanyOwnership, updatePartOfCompany);

module.exports = router;
