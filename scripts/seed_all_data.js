const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI missing');
  process.exit(1);
}

// স্কিমা
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  phone: String, role: String,
}, { timestamps: true });

const ArtisanProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  biodataId: { type: String, unique: true },
  fullName: String, gender: String, mobileNumber: String,
  skillDetails: String, totalExperience: String, currentDistrict: String,
  selectedCategories: [String], expectedSalary: Number,
  status: { type: String, default: 'Approved' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const CompanyProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: String, businessCategory: String, ownerName: String,
  description: String, numberOfEmployees: String, officeAddress: String,
  division: String, district: String, businessPhone: String,
  officialEmail: String, website: String, facebookPage: String,
  status: { type: String, default: 'Approved' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String, category: String, workersRequired: Number, description: String,
  salary: Number, location: String, status: { type: String, default: 'Published' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const ArtisanProfile = mongoose.models.ArtisanProfile || mongoose.model('ArtisanProfile', ArtisanProfileSchema);
const CompanyProfile = mongoose.models.CompanyProfile || mongoose.model('CompanyProfile', CompanyProfileSchema);
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

// ডাটা
const categories = [
  'পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার',
  'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার',
  'Arabian ডিজাইন', 'ব্লেজার স্পেশালিস্ট', 'শেরওয়ানি দর্জি', 'থ্রি-পিস দর্জি',
  'কামিজ দর্জি', 'কোট দর্জি', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর'
];

const companyNames = [
  'ঢাকা গার্মেন্টস লিমিটেড', 'চট্টগ্রাম টেইলার্স', 'সিলেট বুটিক হাউজ', 'রাজশাহী ফ্যাশন',
  'খুলনা টেক্সটাইল', 'বরিশাল গার্মেন্টস', 'মিরপুর টেইলার্স', 'উত্তরা ফ্যাশন হাউজ',
  'ধানমন্ডি বুটিক', 'গুলশান গার্মেন্টস', 'মহাখালী টেইলার্স', 'বনানী ফ্যাশন',
  'সাভার গার্মেন্টস', 'নারায়ণগঞ্জ টেক্সটাইল', 'গাজীপুর ফ্যাশন', 'টঙ্গী টেইলার্স',
  'কুমিল্লা গার্মেন্টস', 'ময়মনসিংহ বুটিক', 'রংপুর ফ্যাশন', 'বগুড়া টেক্সটাইল'
];

const jobTitles = [
  'সুইং মেশিন অপারেটর', 'কাটিং মাস্টার', 'সিনিয়র দর্জি', 'এমব্রয়ডারি অপারেটর',
  'কোয়ালিটি কন্ট্রোলার', 'গার্মেন্টস সুপারভাইজার', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর',
  'ফিনিশিং ওয়ার্কার', 'প্রোডাকশন ম্যানেজার'
];

const firstNames = ['রফিক', 'করিম', 'জাহিদ', 'সুমন', 'আব্দুল', 'মিজান', 'সাকিব', 'নাজমুল', 'ফরিদ', 'হাসান', 'রাকিব', 'শাকিল', 'তানভীর', 'আশিক', 'জুবায়ের'];
const lastNames = ['ইসলাম', 'হোসেন', 'আহমেদ', 'খান', 'মিয়া', 'আলী', 'রহমান', 'সরকার', 'শেখ', 'হক'];
const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // === পুরনো টেস্ট ডাটা ডিলিট (শুধু @testseed.com) ===
    console.log('🗑️  Clearing old test data...');
    
    // টেস্ট ইউজার খুঁজে বের করা
    const testUsers = await User.find({ email: { $regex: /@testseed\.com$/ } });
    const testUserIds = testUsers.map(u => u._id);
    
    if (testUserIds.length > 0) {
      // টেস্ট ইউজারদের প্রোফাইল ও জব ডিলিট
      await ArtisanProfile.deleteMany({ user: { $in: testUserIds } });
      await CompanyProfile.deleteMany({ user: { $in: testUserIds } });
      await Job.deleteMany({ company: { $in: testUserIds } });
      // টেস্ট ইউজার ডিলিট
      await User.deleteMany({ _id: { $in: testUserIds } });
      console.log(`✅ Deleted ${testUserIds.length} old test users and related data`);
    } else {
      console.log('ℹ️  No old test data found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    // === ১০ জন কারিগর ===
    console.log('\n👨‍🔧 Creating 10 artisans...');
    for (let i = 1; i <= 10; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      
      // ইউজার তৈরি
      const artisanUser = await User.create({
        name: fullName,
        email: `artisan${i}@testseed.com`,
        password: hashedPassword,
        phone: `017100000${String(i).padStart(2, '0')}`,
        role: 'artisan',
      });

      const category = categories[i % categories.length];
      
      // প্রোফাইল তৈরি (biodataId ইউনিক করতে SEED- প্রিফিক্স)
      await ArtisanProfile.create({
        user: artisanUser._id,
        biodataId: `SEED-DKKM-${String(i).padStart(3, '0')}`, // ইউনিক প্রিফিক্স
        fullName: fullName,
        gender: i % 2 === 0 ? 'female' : 'male',
        mobileNumber: `017100000${String(i).padStart(2, '0')}`,
        skillDetails: `${category} - দক্ষ কারিগর`,
        totalExperience: `${i} বছর`,
        currentDistrict: districts[i % districts.length],
        selectedCategories: [category],
        expectedSalary: 15000 + (i * 1000),
        status: 'Approved',
        views: Math.floor(Math.random() * 100),
      });
      
      console.log(`  ✓ ${fullName} - ${category}`);
    }
    console.log('✅ Created 10 artisans');

    // === ২০ টি কোম্পানি ===
    console.log('\n🏢 Creating 20 companies...');
    const companyIds = [];
    for (let i = 1; i <= 20; i++) {
      const companyName = companyNames[i - 1];
      
      const companyUser = await User.create({
        name: companyName,
        email: `company${i}@testseed.com`,
        password: hashedPassword,
        phone: `017200000${String(i).padStart(2, '0')}`,
        role: 'company',
      });
      
      companyIds.push(companyUser._id);

      await CompanyProfile.create({
        user: companyUser._id,
        companyName: companyName,
        businessCategory: ['গার্মেন্টস', 'টেক্সটাইল', 'বুটিক', 'ফ্যাশন হাউজ'][i % 4],
        ownerName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        description: `${companyName} একটি দক্ষ পোশাক প্রস্তুতকারক প্রতিষ্ঠান।`,
        numberOfEmployees: `${10 + (i * 5)} জন`,
        officeAddress: `${i * 10} নম্বর রোড, ${districts[i % districts.length]}`,
        division: districts[i % districts.length],
        district: districts[i % districts.length],
        businessPhone: `017200000${String(i).padStart(2, '0')}`,
        officialEmail: `company${i}@testseed.com`,
        website: `https://company${i}.com`,
        status: 'Approved',
        views: Math.floor(Math.random() * 50),
      });
      console.log(`  ✓ ${companyName}`);
    }
    console.log('✅ Created 20 companies');

    // === ৫০ টি জব ===
    console.log('\n📋 Creating 50 jobs...');
    const jobs = [];
    for (let i = 1; i <= 50; i++) {
      const companyId = companyIds[i % companyIds.length];
      const title = jobTitles[i % jobTitles.length];
      const category = categories[i % categories.length];
      
      jobs.push({
        company: companyId,
        title: `${title} (প্রয়োজন ${i})`,
        category: category,
        workersRequired: (i % 5) + 1,
        description: `${title} পদে ${(i % 5) + 1} জন দক্ষ কারিগর প্রয়োজন। অভিজ্ঞতা ${i % 10} বছর।`,
        salary: 12000 + (i * 200),
        location: districts[i % districts.length],
        status: 'Published',
      });
    }
    await Job.insertMany(jobs);
    console.log('✅ Created 50 jobs');

    // === সারাংশ ===
    console.log('\n🎉 সব ডাটা সফলভাবে তৈরি হয়েছে!');
    console.log('━'.repeat(50));
    console.log(`👨‍🔧 কারিগর: 10 জন`);
    console.log(`🏢 কোম্পানি: 20 টি`);
    console.log(`📋 জব: 50 টি`);
    console.log('━'.repeat(50));
    console.log('\n🔑 টেস্ট লগইন:');
    console.log('   Artisan: artisan1@testseed.com / test123');
    console.log('   Company: company1@testseed.com / test123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
