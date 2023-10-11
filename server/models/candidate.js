const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: false, default: "" },
  education: { type: String, required: false, default: "" },
  currentCompany: { type: String, required: false, default: "" },
  linkedin: { type: String, required: false, default: "" },
  about: { type: String, required: false, default: "" },
  applications: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
