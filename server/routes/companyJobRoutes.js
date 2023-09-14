const express = require('express');
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const companyJobController = require("../controllers/companyJob");

router.get("/", companyJobController.getAllCompanyJobs);
router.get("/:jobId", companyJobController.getCompanyJob);

module.exports = router;