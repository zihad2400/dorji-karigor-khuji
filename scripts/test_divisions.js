const districts = {
  "ঢাকা": ["ঢাকা", "গাজীপুর"],
  "চট্টগ্রাম": ["চট্টগ্রাম", "কক্সবাজার"],
  "রাজশাহী": ["রাজশাহী", "বগুড়া"],
  "খুলনা": ["খুলনা", "বাগেরহাট"],
  "বরিশাল": ["বরিশাল", "বরগুনা"],
  "সিলেট": ["সিলেট", "হবিগঞ্জ"],
  "রংপুর": ["রংপুর", "দিনাজপুর"],
  "ময়মনসিংহ": ["ময়মনসিংহ", "জামালপুর"]
};

const divisions = Object.keys(districts);

console.log('=== Divisions from districts keys ===\n');
divisions.forEach(div => {
  console.log(`✅ ${div}: ${districts[div].length} জেলা`);
});

console.log('\nমোট বিভাগ:', divisions.length);
