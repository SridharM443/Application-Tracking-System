const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobPostingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  roleType: {
    type: String,
    enum: ['technical', 'non-technical'],
    required: true
  },
  resume: {
    type: String,
    required: false
  },
  contactInfo: {
    email: String,
    phone: String
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedByRole: {
      type: String,
      enum: ['applicant', 'admin', 'botMimic']
    },
    comment: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add initial status to history when creating application
applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: 'Applied',
      updatedBy: this.applicantId,
      updatedByRole: 'applicant',
      comment: 'Application submitted',
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
