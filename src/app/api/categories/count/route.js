import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';


export async function GET() {
  try {
    await connectDB();
    const categories = [
      'পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার', 
      'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার',
      'Arabian ডিজাইন', 'ব্লেজার স্পেশালিস্ট', 'শেরওয়ানি দর্জি', 'থ্রি-পিস দর্জি',
      'কামিজ দর্জি', 'কোট দর্জি', 'প্যাটার্ন মেকার', 'ওভারলক অপারেটর'
    ];

    const counts = {};
    for (const cat of categories) {
      counts[cat] = await ArtisanProfile.countDocuments({ 
        status: 'Approved',
        selectedCategories: { $in: [cat] }
      });
    }

    return NextResponse.json({ counts });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
