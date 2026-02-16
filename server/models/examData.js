const mongoose = require('mongoose');

const externalExaminerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  }
}, { _id: false });

const internalExaminerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, { _id: false });

const examDataSchema = new mongoose.Schema({
  // Primary identifiers
  semester: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  subjectCode: {
    type: String,
    required: true
  },
  // Dependent fields
  studentsEnrolled: {
    type: Number,
    required: true
  },
  verification: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  internals: [internalExaminerSchema],
  externals: [externalExaminerSchema],
  // Tracking fields
  filledBy: {
    type: String,
    required: true
  },
  filledAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for semester and subjectName for efficient queries
examDataSchema.index({ semester: 1, subjectName: 1 });

const ExamData = mongoose.model('ExamData', examDataSchema);

module.exports = ExamData;
