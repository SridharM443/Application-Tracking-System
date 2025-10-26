const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },
  roleType: {
    type: String,
    enum: ['technical', 'non-technical'],
    required: [true, 'Please specify role type']
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  salaryRange: {
    min: Number,
    max: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);
