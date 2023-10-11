const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  company_image: {
    type: String,
    required: false,
  },
  skills: {
    type: [String],
    required: true,
  },
  validation: {
    type: Boolean,
    required: true,
  },
  yearly_salary_min: {
    type: Number,
    required: true,
  },
  yearly_salary_max: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date_posted: {
    type: Date,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  job_level: {
    type: String,
    required: true,
  },
  education_level: {
    type: String,
    required: true,
  },
  job_status: {
    type: String,
    required: true,
  },
  job_enrollment_status: {
    type: String,
    required: true,
  },
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: false },
  applications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
});

const Job = mongoose.model('Job', jobsSchema);
module.exports = Job;