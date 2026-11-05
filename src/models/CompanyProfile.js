import mongoose from 'mongoose';

const CompanyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    businessCategory: { type: String },
    ownerName: { type: String, required: true },
    establishedYear: { type: String },
    description: { type: String },
    numberOfEmployees: { type: String },
    
    // Location
    officeAddress: { type: String },
    division: { type: String },
    district: { type: String },
    upazila: { type: String },

    // Contact (Public)
    businessPhone: { type: String },
    officialEmail: { type: String },
    website: { type: String },
    facebookPage: { type: String },

    // Private Contact
    ownerPhone: { type: String },
    ownerWhatsapp: { type: String },

    // Facilities
    accommodationFacilities: { type: Boolean, default: false },
    foodFacilities: { type: Boolean, default: false },
    
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Hidden', 'Suspended'],
      default: 'Draft',
    },
    adminFeedback: { type: String },
    
    // নতুন: ভিউ কাউন্ট
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.CompanyProfile || mongoose.model('CompanyProfile', CompanyProfileSchema);
