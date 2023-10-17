const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  getAllCandidates,
  createCandidate,
  getCandidate,
  deleteOneCandidate,
  updateCandidate,
  updatePartOfCandidate,
  getAllCandidateApplications,
  getCandidateApplication,
} = require("../controllers/candidate");
const {
  verifyCandidateOwnership,
  checkIfCandidate,
} = require("../authMiddleware");

router.get("/:id/applications/", checkIfCandidate, getAllCandidateApplications);
router.get(
  "/:id/applications/:applicationId",
  checkIfCandidate,
  getCandidateApplication
);

router.get("/", getAllCandidates);
router.get("/:id", getCandidate);

router.post("/", createCandidate);

router.use("/:id", verifyCandidateOwnership);

router.delete("/:id", deleteOneCandidate);
router.put("/:id", updateCandidate);
router.patch("/:id", updatePartOfCandidate);

module.exports = router;
