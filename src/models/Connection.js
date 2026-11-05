import mongoose from 'mongoose';
import User from './User';

const ConnectionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['artisan', 'company', 'package'], required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    packageId: { type: String },
    connectionCount: { type: Number, default: 1 },
    amount: { type: Number },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);
