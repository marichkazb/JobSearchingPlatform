const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new mongoose.Schema({
  application_num: { type: Number, required: true },
  questions: { type: String, required: true },
  jobId: { type: Schema.Types.ObjectId, ref: "Jobs", required: false },
});

module.exports = mongoose.model('Application', applicationSchema);