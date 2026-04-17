const mongoose = require("mongoose");

async function connectDB() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth service connected to MongoDB");
    return;
  }

  const {
    MONGO_ROOT_USERNAME,
    MONGO_ROOT_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
    AUTH_DB,
  } = process.env;

  const uri = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${AUTH_DB}?authSource=admin`;
  await mongoose.connect(uri);
  console.log("Auth service connected to MongoDB");
}

module.exports = {
  connectDB,
};
