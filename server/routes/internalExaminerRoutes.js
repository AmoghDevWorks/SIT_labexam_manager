const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const {
  createInternalExaminer,
  getAllInternalExaminers,
  updateInternalExaminer,
  deleteInternalExaminer,
  loginInternalExaminer,
} = require("../controllers/internalExaminerController");

// Public route - login
router.post("/login", loginInternalExaminer);

// Admin-only operations
router.post("/", verifyToken, verifyAdmin, createInternalExaminer);
router.put("/:id", verifyToken, verifyAdmin, updateInternalExaminer);
router.delete("/:id", verifyToken, verifyAdmin, deleteInternalExaminer);

// Read operations - accessible by authenticated users
router.get("/", verifyToken, getAllInternalExaminers);

module.exports = router;
