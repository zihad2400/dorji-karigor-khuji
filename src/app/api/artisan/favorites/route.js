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

    // আমি যাদের পছন্দ করেছি (মানে যাদের প্রোফাইলে আমার আইডি favorites অ্যারেতে আছে)
    const favorites = await ArtisanProfile.find({ favorites: decoded.userId })
      .select('biodataId fullName primarySkill currentDistrict gender');
    
    return NextResponse.json({ favorites });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
