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
  verifyCompanyId,
  verifyUserEmail,
} = require("../authMiddleware");

router.post("/", checkIfUser, postApplicationsForJobs);
router.get("/", verifyCompanyId, getApplicationsForJobs);
router.get(
  "/:application_id",
  verifyCompanyId,
  verifyUserEmail, 
  getOneApplicationForJob
); // NEEDS REVISITING
router.delete("/:application_id", verifyCompanyId, deleteOneApplicationForJob);

module.exports = router;