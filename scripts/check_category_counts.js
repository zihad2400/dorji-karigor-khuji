const mongoose = require('mongoose');
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

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const db = mongoose.connection.db;
    
    const artisanCount = await db.collection('artisanprofiles').countDocuments();
    console.log(`👨‍🔧 Total Artisan Profiles: ${artisanCount}`);

    const categories = [
      'পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার', 
      'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার',
      'Arabian ডিজাইন', 'ব্লেজার স্পেশালিস্ট', 'শেরওয়ানি দর্জি', 'থ্রি-পিস দর্জি',
      'কামিজ দর্জি', 'কোট দর্জি', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর'
    ];
    
    console.log('\n=== ক্যাটাগরি ওয়াইজ কাউন্ট ===');
    for (const cat of categories) {
      const count = await db.collection('artisanprofiles').countDocuments({ 
        status: 'Approved',
        selectedCategories: cat
      });
      console.log(`${cat}: ${count} জন`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

check();
