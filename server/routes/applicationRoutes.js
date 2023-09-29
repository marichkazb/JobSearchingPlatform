const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  getAllApplications,
  createApplicationCollection,
  createApplication,
  deleteAllApplications,
  getApplication,
  updateApplication,
  deleteOneApplication,
} = require("../controllers/application");
const {
  authenticate,
  checkIfAdmin,
  checkIfCompany,
  checkIfUser,
  verifyCompanyEmail,
  verifyUserEmail,
} = require("../authMiddleware");

router.use(authenticate);

router.get("/", checkIfAdmin, getAllApplications);
router.post("/", checkIfCompany, createApplicationCollection);
router.post("/", checkIfCompany, createApplication);
router.delete("/", checkIfAdmin, deleteAllApplications);
router.get("/:id", verifyCompanyEmail, verifyUserEmail, getApplication); // NEEDS REVISITING
router.put("/:id", checkIfUser, verifyUserEmail, updateApplication); 
router.patch("/:id", checkIfUser, verifyUserEmail, updateApplication);
router.delete("/:id", checkIfUser, verifyUserEmail, deleteOneApplication);

module.exports = router;
