const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Admin", adminSchema);
