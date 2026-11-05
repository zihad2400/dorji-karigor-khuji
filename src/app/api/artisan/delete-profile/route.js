import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();

    const profile = await ArtisanProfile.findOne({ user: decoded.userId });
    if (!profile) {
      return NextResponse.json({ message: 'কোনো বায়োডাটা পাওয়া যায়নি' }, { status: 404 });
    }

    await ArtisanProfile.findOneAndDelete({ user: decoded.userId });

    return NextResponse.json({ message: 'বায়োডাটা সফলভাবে ডিলিট হয়েছে' });
  } catch (error) {
    return NextResponse.json({ message: 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
