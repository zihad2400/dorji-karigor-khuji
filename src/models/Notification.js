import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // optional
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['biodata_submitted', 'biodata_approved', 'biodata_rejected', 'new_user', 'system'],
      default: 'system',
    },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
