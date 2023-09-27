const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const adminController = require("../controllers/admin");
const { authenticate, checkIfCompany, verifyCompanyEmail } = require("../authMiddleware"); // Adjust the path to where your authMiddleware.js file is located

router.use(authenticate);

router.get("/", adminController.getAllAdmins);
router.post("/", checkIfCompany, verifyCompanyEmail, adminController.createAdmin);
router.get("/:id", adminController.getAdmin);
router.delete("/:id", adminController.deleteOneAdmin);
router.put("/:id", adminController.updateAdmin);
router.patch("/:id", adminController.updatePartOfAdmin);

module.exports = router;