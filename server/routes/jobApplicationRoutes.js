const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const jobApplicationController = require("../controllers/jobApplication");

router.post("/", jobApplicationController.postApplicationsForJobs);
router.get("/", jobApplicationController.getApplicationsForJobs);
router.get("/:application_id", jobApplicationController.getOneApplicationForJob);
router.delete("/:application_id", jobApplicationController.deleteOneApplicationForJob);

module.exports = router;