import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();

    // আমার প্রোফাইল খুঁজে বের করা
    const myProfile = await ArtisanProfile.findOne({ user: decoded.userId });
    if (!myProfile) return NextResponse.json({ likedBy: [] });

    // যারা আমাকে পছন্দ করেছে (আমার প্রোফাইলের favorites অ্যারে থেকে)
    const likedBy = await ArtisanProfile.find({ user: { $in: myProfile.favorites || [] } })
      .populate('user', 'name email')
      .select('biodataId fullName primarySkill gender');

    return NextResponse.json({ likedBy });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
