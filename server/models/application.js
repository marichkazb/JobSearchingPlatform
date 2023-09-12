const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  application_num: { type: Number, required: true },
  questions: { type: String, required: true },
});

module.exports = mongoose.model('Application', applicationSchema);