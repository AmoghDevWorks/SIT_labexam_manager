const mongoose = require("mongoose");

const internalExaminerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// Cascade delete: Remove all subject assignments when examiner is deleted
internalExaminerSchema.pre('findOneAndDelete', async function(next) {
  try {
    const examinerId = this.getQuery()._id;
    const SubjectAssignment = mongoose.model('SubjectAssignment');
    await SubjectAssignment.deleteMany({ internalExaminerId: examinerId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("InternalExaminer", internalExaminerSchema);
