const mongoose = require("mongoose");

const internalExaminerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// Cascade delete: Remove all subject assignments when examiner is deleted
const cascadeDeleteAssignments = async function() {
  const examinerId = this.getQuery()._id;
  const SubjectAssignment = mongoose.model('SubjectAssignment');
  await SubjectAssignment.deleteMany({ internalExaminerId: examinerId });
};

// Register middleware for both delete methods
internalExaminerSchema.pre('findOneAndDelete', cascadeDeleteAssignments);
internalExaminerSchema.pre('findByIdAndDelete', cascadeDeleteAssignments);

module.exports = mongoose.model("InternalExaminer", internalExaminerSchema);
