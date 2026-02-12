const express = require('express');
const router = express.Router();
const {
  createExamData,
  getAllExamData,
  getExamDataById,
  getExamDataBySemester,
  getExamDataBySemesterAndSubject,
  updateExamData,
  deleteExamData,
  checkExistingExamData
} = require('../controllers/examDataController');

// Create new exam data
router.post('/', createExamData);

// Get all exam data
router.get('/', getAllExamData);

// Check if exam data exists for semester and subject code (must be before /:id route)
router.get('/check/:semester/:subjectCode', checkExistingExamData);

// Get exam data by ID
router.get('/:id', getExamDataById);

// Get exam data by semester
router.get('/semester/:semester', getExamDataBySemester);

// Get exam data by semester and subject
router.get('/semester/:semester/subject/:subjectName', getExamDataBySemesterAndSubject);

// Update exam data
router.put('/:id', updateExamData);

// Delete exam data
router.delete('/:id', deleteExamData);

module.exports = router;
