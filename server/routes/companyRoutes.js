const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const companyController = require("../controllers/company");
const companyJobRoutes = require("./companyJobRoutes");

const { authenticate, checkIfCompany, verifyCompanyEmail } = require("../authMiddleware");

router.use("/:companyId/jobs", companyJobRoutes);

//router.use(authenticate);

//router.get("/", companyController.getAllCompanies);
//router.post("/", checkIfCompany, verifyCompanyEmail, companyController.createCompany);
//router.get("/:id", companyController.getCompany);
//router.delete("/:id", checkIfCompany, verifyCompanyEmail, companyController.deleteOneCompany);
//router.put("/:id", checkIfCompany, verifyCompanyEmail, companyController.updateCompany);
//router.patch("/:id", checkIfCompany, verifyCompanyEmail, companyController.updatePartOfCompany);

router.get("/", companyController.getAllCompanies);
router.post("/", companyController.createCompany);
router.get("/:id", companyController.getCompany);
router.delete("/:id", companyController.deleteOneCompany);
router.put("/:id", companyController.updateCompany);
router.patch("/:id", companyController.updatePartOfCompany);

module.exports = router;