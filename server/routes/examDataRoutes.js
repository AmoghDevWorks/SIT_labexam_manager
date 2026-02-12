const express = require('express');
const router = express.Router();
const {
  createExamData,
  getAllExamData,
  getExamDataById,
  getExamDataBySemester,
  getExamDataBySemesterAndSubject,
  updateExamData,
  deleteExamData
} = require('../controllers/examDataController');

// Create new exam data
router.post('/', createExamData);

// Get all exam data
router.get('/', getAllExamData);

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
