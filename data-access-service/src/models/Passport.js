const mongoose = require("mongoose");

const passportSchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdBy: {
      id: String,
      email: String,
      role: String,
    },
    updatedBy: {
      id: String,
      email: String,
      role: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Passport", passportSchema);

