const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Database connection failed ❌");
    console.error(error.message); // 👈 ADD THIS
    process.exit(1);
  }
};

module.exports = connectDB;
