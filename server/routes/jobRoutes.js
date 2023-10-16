const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const multer = require("multer");

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


// Set up multer for file storage
const storage = multer.memoryStorage(); // This stores the file in memory. You might want to save it in a directory or handle it based on your requirement.
const upload = multer({ storage: storage });

router.post("/:id/applications/", checkIfCandidate, upload.single('resume'), postApplicationsForJobs);

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
