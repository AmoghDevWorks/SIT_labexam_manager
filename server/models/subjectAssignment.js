const mongoose = require("mongoose");

const subjectAssignmentSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    internalExaminerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternalExaminer",
      required: true,
    },
  },
  { timestamps: true }
);

// Create compound index to ensure unique subject-examiner pairs
subjectAssignmentSchema.index({ subjectId: 1, internalExaminerId: 1 }, { unique: true });

module.exports = mongoose.model("SubjectAssignment", subjectAssignmentSchema);
