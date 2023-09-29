const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const jobApplicationRoutes = require('./jobApplicationRoutes');
const {
  createJob,
  getAllJobs,
  deleteAllJobs,
  getJobByID,
  updateJobByID,
  deleteJobByID,
} = require("../controllers/job");

const {
  authenticate,
  checkIfAdmin,
  checkIfCompany,
  verifyCompanyEmail,
} = require("../authMiddleware");

router.use(authenticate);

router.use("/:job_id/applications", jobApplicationRoutes);
router.get("/", getAllJobs);
router.get("/:id", getJobByID);
router.post("/", checkIfCompany, createJob);
router.delete("/", checkIfAdmin, deleteAllJobs);
router.put('/:id', verifyCompanyEmail, updateJobByID);
router.patch("/:id", verifyCompanyEmail, updateJobByID);
router.delete("/:id", verifyCompanyEmail, deleteJobByID);

module.exports = router;