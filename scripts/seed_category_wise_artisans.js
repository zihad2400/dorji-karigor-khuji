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

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const ArtisanProfile = mongoose.models.ArtisanProfile || mongoose.model('ArtisanProfile', ArtisanProfileSchema);

const categories = [
  'পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার', 
  'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার',
  'Arabian ডিজাইন', 'ব্লেজার স্পেশালিস্ট', 'শেরওয়ানি দর্জি', 'থ্রি-পিস দর্জি',
  'কামিজ দর্জি', 'কোট দর্জি', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর'
];

const firstNames = ['রফিক', 'করিম', 'জাহিদ', 'সুমন', 'আব্দুল', 'মিজান', 'সাকিব', 'নাজমুল', 'ফরিদ', 'হাসান', 'রাকিব', 'শাকিল', 'তানভীর', 'আশিক', 'জুবায়ের', 'শামীম', 'বাবুল', 'রুবেল', 'মাসুদ', 'সাইফুল', 'ইমরান', 'আলম', 'নয়ন', 'শুভ', 'রনি', 'সজীব', 'আরিফ', 'মেহেদী', 'শান্ত', 'তুহিন', 'সজল', 'রাজু', 'মামুন', 'সেলিম', 'জসিম', 'আনিস', 'বেলাল', 'কামাল', 'জামাল', 'সোহেল'];
const lastNames = ['ইসলাম', 'হোসেন', 'আহমেদ', 'খান', 'মিয়া', 'আলী', 'রহমান', 'সরকার', 'শেখ', 'হক', 'মোল্লা', 'তালুকদার', 'চৌধুরী', 'খন্দকার', 'মজুমদার'];
const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

async function seedCategoryWise() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // পুরনো SEED-DKKM ডাটা ডিলিট
    console.log('🗑️  Clearing old SEED data...');
    const oldSeedUsers = await User.find({ email: { $regex: /@seedcat\.com$/ } });
    const oldSeedIds = oldSeedUsers.map(u => u._id);
    if (oldSeedIds.length > 0) {
      await ArtisanProfile.deleteMany({ user: { $in: oldSeedIds } });
      await User.deleteMany({ _id: { $in: oldSeedIds } });
      console.log(`✅ Deleted ${oldSeedIds.length} old seed users`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    let totalCreated = 0;
    let nameIndex = 0;

    // প্রতিটি ক্যাটাগরির জন্য ১০ জন করে কারিগর
    for (let catIndex = 0; catIndex < categories.length; catIndex++) {
      const category = categories[catIndex];
      console.log(`\n📂 Creating 10 artisans for: ${category}`);

      for (let i = 1; i <= 10; i++) {
        const firstName = firstNames[nameIndex % firstNames.length];
        const lastName = lastNames[nameIndex % lastNames.length];
        const fullName = `${firstName} ${lastName} ${i}`;
        nameIndex++;
        
        const email = `cat${catIndex + 1}_${i}@seedcat.com`;
        const biodataId = `SEED-${String(catIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        // ইউজার তৈরি
        const artisanUser = await User.create({
          name: fullName,
          email: email,
          password: hashedPassword,
          phone: `017${String(catIndex + 1).padStart(2, '0')}${String(i).padStart(6, '0')}`,
          role: 'artisan',
        });

        // প্রোফাইল তৈরি
        await ArtisanProfile.create({
          user: artisanUser._id,
          biodataId: biodataId,
          fullName: fullName,
          gender: i % 2 === 0 ? 'female' : 'male',
          mobileNumber: `017${String(catIndex + 1).padStart(2, '0')}${String(i).padStart(6, '0')}`,
          skillDetails: `${category} - দক্ষ কারিগর`,
          totalExperience: `${(i % 10) + 1} বছর`,
          currentDistrict: districts[i % districts.length],
          selectedCategories: [category],
          expectedSalary: 15000 + (i * 1000),
          status: 'Approved',
          views: Math.floor(Math.random() * 200),
        });

        totalCreated++;
        console.log(`  ✓ ${fullName} (${category})`);
      }
    }

    // সারাংশ
    console.log('\n🎉 সব ডাটা সফলভাবে তৈরি হয়েছে!');
    console.log('━'.repeat(50));
    console.log(`📂 ক্যাটাগরি: ${categories.length} টি`);
    console.log(`👨‍🔧 প্রতি ক্যাটাগরিতে: 10 জন`);
    console.log(`👨‍🔧 মোট কারিগর তৈরি: ${totalCreated} জন`);
    console.log('━'.repeat(50));

    // ক্যাটাগরি ওয়াইজ চেক
    console.log('\n📊 ক্যাটাগরি ওয়াইজ কাউন্ট:');
    for (const cat of categories) {
      const count = await ArtisanProfile.countDocuments({ 
        status: 'Approved',
        selectedCategories: cat
      });
      console.log(`  ${cat}: ${count} জন`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedCategoryWise();
