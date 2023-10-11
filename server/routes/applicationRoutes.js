const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  getAllApplications,
  createApplication,
  deleteAllApplications,
  getApplication,
  updateApplication,
  deleteOneApplication,
} = require("../controllers/application");
const {
  checkIfAdmin,
  checkIfCandidate,
  verifyApplicationVisibility,
  verifyApplicationOwnership,
} = require("../authMiddleware");

router.get("/", checkIfAdmin, getAllApplications);
router.delete("/", checkIfAdmin, deleteAllApplications);

router.post("/", checkIfCandidate, createApplication); // handles both single application and application collections

router.use("/:id", verifyApplicationVisibility);
router.get("/:id", getApplication);

router.use("/:id", verifyApplicationOwnership);
router.put("/:id", updateApplication);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteOneApplication);

module.exports = router;
