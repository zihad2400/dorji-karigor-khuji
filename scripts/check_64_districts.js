const fs = require('fs');
const filePath = 'src/app/artisan/edit-biodata/page.js';
let content = fs.readFileSync(filePath, 'utf8');

// DISTRICTS_DATA খুঁজে বের করা
const match = content.match(/const DISTRICTS_DATA = \{[\s\S]*?\};/);

if (match) {
  // ডাটা এক্সট্রাক্ট করা
  const dataStr = match[0].replace('const DISTRICTS_DATA = ', '').replace(/;$/, '');
  
  try {
    // JSON হিসেবে পার্স করা
    const data = eval('(' + dataStr + ')');
    
    let totalDistricts = 0;
    console.log('=== বাংলাদেশের জেলা তালিকা ===\n');
    
    Object.keys(data).forEach(division => {
      const districts = data[division];
      totalDistricts += districts.length;
      console.log(`📍 ${division} (${districts.length} জেলা):`);
      console.log(`   ${districts.join(', ')}`);
      console.log('');
    });
    
    console.log('━'.repeat(50));
    console.log(`✅ মোট বিভাগ: ${Object.keys(data).length}`);
    console.log(`✅ মোট জেলা: ${totalDistricts}`);
    
    if (totalDistricts === 64) {
      console.log('🎉 ৬৪টি জেলা সম্পূর্ণ আছে!');
    } else {
      console.log(`⚠️  ${64 - totalDistricts}টি জেলা কম আছে!`);
    }
    
  } catch (error) {
    console.error('❌ ডাটা পার্স করতে সমস্যা:', error.message);
  }
} else {
  console.log('❌ DISTRICTS_DATA খুঁজে পাওয়া যায়নি');
}
