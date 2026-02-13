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
subjectSchema.pre('findOneAndDelete', async function(next) {
  try {
    const subjectId = this.getQuery()._id;
    const SubjectAssignment = mongoose.model('SubjectAssignment');
    await SubjectAssignment.deleteMany({ subjectId: subjectId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Subject", subjectSchema);
