const express = require("express");
const router = express.Router();
const {
  createSubjectEntry,
  getSubjectEntryStatus,
  toggleSubjectEntry,
  updateSubjectEntry,
  deleteSubjectEntry,
} = require("../controllers/manageSubjectEntryController");

router.post("/", createSubjectEntry);
router.get("/", getSubjectEntryStatus);
router.patch("/toggle", toggleSubjectEntry);
router.put("/", updateSubjectEntry);
router.delete("/", deleteSubjectEntry);

module.exports = router;
