const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new mongoose.Schema({
  questions: {
    type: [],
    required: true
  },
  dateOfApplication: {
    type: Date,
    default: Date.now,
    required: false,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  skills: [{
    type: String,
  }],
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Jobs",
    required: false
  },
});

module.exports = mongoose.model('Application', applicationSchema);