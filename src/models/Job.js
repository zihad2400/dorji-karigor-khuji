import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    workersRequired: { type: Number, required: true },
    description: { type: String, required: true },
    salary: { type: Number },
    salaryNegotiable: { type: Boolean, default: false },
    location: { type: String },
    accommodation: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    overtime: { type: Boolean, default: false },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Published', 'Paused', 'Expired', 'Rejected', 'Closed'],
      default: 'Pending Approval',
    },
    adminFeedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
