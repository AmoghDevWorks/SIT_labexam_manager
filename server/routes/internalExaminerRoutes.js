const express = require("express");
const router = express.Router();

const {
  createInternalExaminer,
  getAllInternalExaminers,
  updateInternalExaminer,
  deleteInternalExaminer,
  loginInternalExaminer,
} = require("../controllers/internalExaminerController");

router.post("/", createInternalExaminer);
router.post("/login", loginInternalExaminer);
router.get("/", getAllInternalExaminers);
router.put("/:id", updateInternalExaminer);
router.delete("/:id", deleteInternalExaminer);

module.exports = router;
