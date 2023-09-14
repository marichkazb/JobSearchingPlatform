const express = require("express");
const router = express.Router({ mergeParams: true }); // Accessing params from parent router
const applicationController = require("../controllers/application");

router.get("/", applicationController.getAllApplications);
router.post("/", applicationController.createApplicationCollection);
router.post("/", applicationController.createApplication);
router.delete("/", applicationController.deleteAllApplications);

router.get("/:id", applicationController.getApplication);
router.put("/:id", applicationController.updateApplication);
router.patch("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteOneApplication);

module.exports = router;