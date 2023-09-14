const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  logo: { type: String, required: false, default: "" },
  locations: {
    type: [String],
    required: false,
    default: ["Gothenburg"],
  },
  jobs: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Company", companySchema);
