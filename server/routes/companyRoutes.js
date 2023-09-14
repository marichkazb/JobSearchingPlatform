const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const companyController = require("../controllers/company");
const companyJobRoutes = require("./companyJobRoutes");

router.use("/:companyId/jobs", companyJobRoutes);

router.get("/", companyController.getAllCompanies);
router.post("/", companyController.createCompany);
router.get("/:id", companyController.getCompany);
router.delete("/:id", companyController.deleteOneCompany);
router.put("/:id", companyController.updateCompany);
router.patch("/:id", companyController.updatePartOfCompany);

module.exports = router;