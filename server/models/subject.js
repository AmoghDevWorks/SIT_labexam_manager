const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Cascade delete: Remove all subject assignments when subject is deleted
const cascadeDeleteAssignments = async function() {
  const subjectId = this.getQuery()._id;
  const SubjectAssignment = mongoose.model('SubjectAssignment');
  await SubjectAssignment.deleteMany({ subjectId: subjectId });
};

// Register middleware for both delete methods
subjectSchema.pre('findOneAndDelete', cascadeDeleteAssignments);
subjectSchema.pre('findByIdAndDelete', cascadeDeleteAssignments);

module.exports = mongoose.model("Subject", subjectSchema);
