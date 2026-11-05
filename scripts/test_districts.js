const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const districts = {
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'কিশোরগঞ্জ'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার'],
  'রাজশাহী': ['রাজশাহী', 'বগুড়া'],
};

// চেক করা প্রতিটি ডিভিশনের জন্য জেলা আছে কিনা
console.log('=== Division → District Mapping Test ===\n');

divisions.forEach(div => {
  if (districts[div]) {
    console.log(`✅ ${div}: ${districts[div].length} জেলা (${districts[div].join(', ')})`);
  } else {
    console.log(`❌ ${div}: কোনো জেলা পাওয়া যায়নি!`);
  }
});
