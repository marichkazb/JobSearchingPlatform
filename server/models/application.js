const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new mongoose.Schema({
  dateOfApplication: {
    type: Date,
    default: Date.now,
    required: false,
  },
  status: {
    type: String,
    default: "Pending",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  motivation: {
    type: String,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Jobs",
    required: true,
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "Candidates",
    required: true,
  },
  resume: {
    type: Buffer,
    required: false,
  },
});

module.exports = mongoose.model('Application', applicationSchema);