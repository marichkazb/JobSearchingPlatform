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
  verifyCompanyId,
} = require("../authMiddleware");

router.use(authenticate);

router.use("/:companyId/jobs", companyJobRoutes);
router.get("/", getAllCompanies);
router.get("/:id", getCompany);

router.post("/", createCompany);

router.use(checkIfCompany);
router.delete("/:id", verifyCompanyId, deleteOneCompany);
router.put("/:id", verifyCompanyId, updateCompany);
router.patch("/:id", verifyCompanyId, updatePartOfCompany);

module.exports = router;
