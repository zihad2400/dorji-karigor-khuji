import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();

    const { action } = await req.json(); // 'hide' অথবা 'live'

    const profile = await ArtisanProfile.findOne({ user: decoded.userId });
    if (!profile) {
      return NextResponse.json({ message: 'বায়োডাটা পাওয়া যায়নি' }, { status: 404 });
    }

    // শুধুমাত্র Approved বায়োডাটা হাইড বা লাইভ করা যাবে
    if (profile.status !== 'Approved' && profile.status !== 'Hidden') {
      return NextResponse.json({ message: 'শুধুমাত্র অনুমোদিত বায়োডাটা লাইভ বা হাইড করা যাবে' }, { status: 400 });
    }

    if (action === 'hide') {
      profile.status = 'Hidden';
    } else if (action === 'live') {
      profile.status = 'Approved';
    } else {
      return NextResponse.json({ message: 'ভুল অ্যাকশন' }, { status: 400 });
    }

    await profile.save();

    return NextResponse.json({ message: `বায়োডাটা ${action === 'live' ? 'লাইভ' : 'হাইড'} করা হয়েছে`, status: profile.status });
  } catch (error) {
    return NextResponse.json({ message: 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
