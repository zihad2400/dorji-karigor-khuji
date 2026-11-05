import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const { profileId } = await req.json();

    await connectDB();

    // চেক করা ইউজার আগে পছন্দ করেছে কিনা
    const profile = await ArtisanProfile.findById(profileId);
    if (!profile) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });

    const hasLiked = profile.favorites?.includes(decoded.userId);

    if (hasLiked) {
      // রিমুভ
      await ArtisanProfile.findByIdAndUpdate(profileId, { $pull: { favorites: decoded.userId } });
    } else {
      // অ্যাড
      await ArtisanProfile.findByIdAndUpdate(profileId, { $push: { favorites: decoded.userId } });
    }

    return NextResponse.json({ liked: !hasLiked });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
