import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Invited', 'Accepted', 'Rejected', 'Hired'],
      default: 'Submitted',
    },
    coverLetter: { type: String },
    companyFeedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
