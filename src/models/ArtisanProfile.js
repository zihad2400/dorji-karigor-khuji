import mongoose from 'mongoose';

const ArtisanProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    biodataId: { type: String, unique: true },
    
    fullName: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dob: { type: Date },
    mobileNumber: { type: String, required: true },
    
    // ঠিকানা
    permanentDivision: { type: String },
    permanentDistrict: { type: String },
    permanentAddress: { type: String },
    currentDivision: { type: String },
    currentDistrict: { type: String },

    // শিক্ষা
    educationLevels: [{ type: String }],
    institutionName: { type: String },
    passingYear: { type: String },

    // পারিবারিক
    fatherName: { type: String },
    motherName: { type: String },
    siblings: { type: String },

    // ব্যক্তিগত (মাল্টিপল সিলেকশন)
    maritalStatus: [{ type: String }], 
    bloodGroup: [{ type: String }],    
    height: { type: String },
    weight: { type: String },
    religion: { type: String },

    // পেশাগত
    selectedCategories: [{ type: String }], 
    skillDetails: { type: String },
    machineExperience: { type: String },
    productionCapacity: { type: String },

    // কর্মক্ষেত্রের সুবিধা
    accommodationRequired: { type: String },
    foodRequired: { type: String },
    workingHours: { type: String },

    // রেফারেন্স
    referenceName: { type: String },
    referencePhone: { type: String },
    referenceRelation: { type: String },

    // যোগাযোগ
    contactEmail: { type: String },
    whatsappNumber: { type: String },
    aboutMe: { type: String },

    // NID ও ডকুমেন্টস
    nidNumber: { type: String },
    nidPdfUrl: { type: String },
    passportPhotoUrl: { type: String },

    // স্ট্যাটাস
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Hidden', 'Suspended'],
      default: 'Pending Approval',
    },
    adminFeedback: { type: String },
    views: { type: Number, default: 0 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.ArtisanProfile || mongoose.model('ArtisanProfile', ArtisanProfileSchema);
