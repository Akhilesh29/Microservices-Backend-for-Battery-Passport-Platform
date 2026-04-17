const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    objectName: {
      type: String,
      default: null,
    },
    contentType: String,
    size: Number,
    storageProvider: {
      type: String,
      enum: ["minio", "mongo"],
      default: "minio",
    },
    fileData: Buffer,
    uploadedBy: {
      id: String,
      email: String,
      role: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
