const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  createJob,
  getAllJobs,
  deleteAllJobs,
  getJobByID,
  updateJobByID,
  deleteJobByID,
  postApplicationsForJobs,
  getApplicationsForJobs,
  getOneApplicationForJob,
  deleteOneApplicationForJob,
} = require("../controllers/job");

const {
  checkIfAdmin,
  checkIfCompany,
  verifyJobOwnership,
  checkIfCandidate,
  verifyApplicationVisibility,
  verifyApplicationOwnership,
} = require("../authMiddleware");

router.post("/:id/applications/", checkIfCandidate, postApplicationsForJobs);

router.get("/:id/applications/", verifyJobOwnership, getApplicationsForJobs);
router.get(
  "/:id/applications/:applicationId",
  verifyJobOwnership,
  getOneApplicationForJob
);

router.delete(
  "/:id/applications/:applicationId",
  deleteOneApplicationForJob
);

router.get("/", getAllJobs);
router.get("/:id", getJobByID);

router.post("/", checkIfCompany, createJob);
router.delete("/", checkIfAdmin, deleteAllJobs);

router.put("/:id", verifyJobOwnership, updateJobByID);
router.patch("/:id", verifyJobOwnership, updateJobByID);
router.delete("/:id", verifyJobOwnership, deleteJobByID);

module.exports = router;
