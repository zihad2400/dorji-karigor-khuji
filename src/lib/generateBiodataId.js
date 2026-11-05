import ArtisanProfile from '@/models/ArtisanProfile';

export async function generateBiodataId(gender) {
  // জেন্ডার অনুযায়ী প্রিফিক্স নির্ধারণ
  const prefix = (gender === 'female') ? 'DKKF' : 'DKKM';
  
  // ওই জেন্ডারের সর্বশেষ বায়োডাটা খুঁজে বের করা
  const lastProfile = await ArtisanProfile.findOne({ 
    biodataId: { $regex: new RegExp(`^${prefix}-\\d+$`) } 
  })
  .sort({ biodataId: -1 })
  .exec();

  let nextNumber = 1;
  if (lastProfile) {
    // যেমন DKKM-05 থেকে 5 বের করা
    const lastNumber = parseInt(lastProfile.biodataId.split('-')[1]);
    nextNumber = lastNumber + 1;
  }

  // সংখ্যাটিকে ২ ডিজিটে ফরম্যাট করা (01, 02, ..., 99, 100)
  const formattedNumber = String(nextNumber).padStart(2, '0');
  
  return `${prefix}-${formattedNumber}`;
}
