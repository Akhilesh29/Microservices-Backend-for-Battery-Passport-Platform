const mongoose = require("mongoose");

async function connectDB() {
  const {
    MONGO_ROOT_USERNAME,
    MONGO_ROOT_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
    PASSPORT_DB,
  } = process.env;

  const uri = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${PASSPORT_DB}?authSource=admin`;
  await mongoose.connect(uri);
  console.log("Data access service connected to MongoDB");
}

module.exports = {
  connectDB,
};

