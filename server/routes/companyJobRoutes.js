const express = require('express');
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  getAllCompanyJobs,
  getCompanyJob,
} = require("../controllers/companyJob");

router.get("/", getAllCompanyJobs);
router.get("/:jobId", getCompanyJob);

module.exports = router;