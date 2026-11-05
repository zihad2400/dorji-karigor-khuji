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

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const db = mongoose.connection.db;
    
    const userCount = await db.collection('users').countDocuments();
    console.log(`👥 Total Users: ${userCount}`);
    
    const artisanCount = await db.collection('artisanprofiles').countDocuments();
    console.log(`👨‍🔧 Artisan Profiles: ${artisanCount}`);
    
    const companyCount = await db.collection('companyprofiles').countDocuments();
    console.log(`🏢 Company Profiles: ${companyCount}`);
    
    const jobCount = await db.collection('jobs').countDocuments();
    console.log(`📋 Jobs: ${jobCount}`);
    
    console.log('\n=== কারিগর প্রোফাইলের ক্যাটাগরি ===');
    const artisans = await db.collection('artisanprofiles').find({}).limit(10).toArray();
    artisans.forEach((a, i) => {
      console.log(`${i+1}. ${a.fullName} | Status: ${a.status} | Categories: ${JSON.stringify(a.selectedCategories)}`);
    });

    console.log('\n=== স্ট্যাটাস অনুযায়ী কারিগর ===');
    const approvedArtisans = await db.collection('artisanprofiles').countDocuments({ status: 'Approved' });
    console.log(`Approved: ${approvedArtisans}`);

    console.log('\n=== ক্যাটাগরি অনুযায়ী কাউন্ট ===');
    const categories = [
      'পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার', 
      'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার',
      'Arabian ডিজাইন', 'ব্লেজার স্পেশালিস্ট', 'শেরওয়ানি দর্জি', 'থ্রি-পিস দর্জি',
      'কামিজ দর্জি', 'কোট দর্জি', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর'
    ];
    
    for (const cat of categories) {
      const count = await db.collection('artisanprofiles').countDocuments({ 
        status: 'Approved',
        selectedCategories: cat
      });
      if (count > 0) {
        console.log(`✅ ${cat}: ${count} জন`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkData();
