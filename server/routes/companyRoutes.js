const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const {
  getAllCompanies,
  createCompany,
  getCompany,
  deleteOneCompany,
  updateCompany,
  updatePartOfCompany,
} = require("../controllers/company");
const companyJobRoutes = require("./companyJobRoutes");
const {
  authenticate,
  checkIfCompany,
  verifyCompanyEmail,
} = require("../authMiddleware");

router.use(authenticate);

router.use("/:companyId/jobs", companyJobRoutes);
router.get("/", getAllCompanies);
router.get("/:id", getCompany);

router.use(checkIfCompany);
router.post("/", createCompany);
router.delete("/:id", verifyCompanyEmail, deleteOneCompany);
router.put("/:id", verifyCompanyEmail, updateCompany);
router.patch("/:id", verifyCompanyEmail, updatePartOfCompany);

module.exports = router;
