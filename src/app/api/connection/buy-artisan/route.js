import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import ArtisanProfile from '@/models/ArtisanProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'কানেকশন কিনতে প্রথমে লগইন করুন' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (err) {
      return NextResponse.json({ message: 'টোকেন মেয়াদোত্তীর্ণ, আবার লগইন করুন' }, { status: 401 });
    }

    const { profileId } = await req.json();
    if (!profileId) {
      return NextResponse.json({ message: 'প্রোফাইল আইডি প্রয়োজন' }, { status: 400 });
    }

    await connectDB();

    const artisanProfile = await ArtisanProfile.findById(profileId);
    if (!artisanProfile) {
      return NextResponse.json({ message: 'আর্টিজান প্রোফাইল পাওয়া যায়নি' }, { status: 404 });
    }

    const receiverId = artisanProfile.user; // আর্টিজানের ইউজার আইডি

    // চেক করা আগে থেকেই কানেকশন আছে কিনা
    const existing = await Connection.findOne({ 
      sender: decoded.userId, 
      receiver: receiverId,
      type: 'artisan'
    });

    if (existing) {
      return NextResponse.json({ message: 'আপনি ইতিমধ্যে এই কারিগরের কানেকশন কিনেছেন', isUnlocked: true }, { status: 200 });
    }

    // নতুন কানেকশন তৈরি
    await Connection.create({
      sender: decoded.userId,
      receiver: receiverId,
      type: 'artisan',
      status: 'active',
    });

    console.log(`✅ Artisan Connection created: User ${decoded.userId} → Artisan ${receiverId}`);

    return NextResponse.json({ message: 'কানেকশন সফলভাবে কেনা হয়েছে!', isUnlocked: true });
  } catch (error) {
    console.error('❌ Buy Artisan Connection Error:', error);
    return NextResponse.json({ message: 'সার্ভার ত্রুটি: ' + (error.message || 'অজানা সমস্যা') }, { status: 500 });
  }
}
