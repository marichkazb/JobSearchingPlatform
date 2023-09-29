const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router

const {
  postApplicationsForJobs,
  getApplicationsForJobs,
  getOneApplicationForJob,
  deleteOneApplicationForJob,
} = require("../controllers/jobApplication");

const {
  checkIfUser,
  verifyCompanyEmail,
  verifyUserEmail,
} = require("../authMiddleware");

router.post("/", checkIfUser, postApplicationsForJobs);
router.get("/", verifyCompanyEmail, getApplicationsForJobs);
router.get(
  "/:application_id",
  verifyCompanyEmail,
  verifyUserEmail, 
  getOneApplicationForJob
); // NEEDS REVISITING
router.delete("/:application_id", verifyCompanyEmail, deleteOneApplicationForJob);

module.exports = router;