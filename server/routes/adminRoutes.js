const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
//const adminController  = require("../controllers/admin"); //refactored to the line below, will delete soon
const {
  getAllAdmins,
  createAdmin,
  getAdmin,
  deleteOneAdmin,
  updateAdmin,
  updatePartOfAdmin,
} = require("../controllers/admin");
const { checkIfAdmin } = require("../authMiddleware");

router.post("/", createAdmin);

router.use(checkIfAdmin);
router.get("/", getAllAdmins);
router.get("/:id", getAdmin);
router.delete("/:id", deleteOneAdmin);
router.put("/:id", updateAdmin);
router.patch("/:id", updatePartOfAdmin);

module.exports = router;
