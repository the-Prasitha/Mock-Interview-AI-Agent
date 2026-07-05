const mongoose = require("mongoose");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(
  process.env.MONGO_URI,
  {
    serverSelectionTimeoutMS: 5000,
  }
);

    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;