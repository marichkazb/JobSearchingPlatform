const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const jobApplicationRoutes = require('./jobApplicationRoutes');
const jobController = require('../controllers/job');

router.use("/:job_id/applications", jobApplicationRoutes);

router.post("/", jobController.createJob);
router.get("/", jobController.getAllJobs);
router.delete("/", jobController.deleteAllJobs);

router.get('/:id', jobController.getJobByID);
router.put('/:id', jobController.updateJobByID);
router.patch('/:id', jobController.updateJobByID);
router.delete('/:id', jobController.deleteJobByID);

module.exports = router;