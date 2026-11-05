import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import Connection from '@/models/Connection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();

    const profile = await ArtisanProfile.findOne({ user: decoded.userId });

    // কানেকশন কাউন্ট
    const connectionsCount = await Connection.countDocuments({ sender: decoded.userId });
    const receivedConnectionsCount = await Connection.countDocuments({ receiver: decoded.userId });

    // পছন্দ কাউন্ট (যাদের আমি পছন্দ করেছি)
    const favoritesCount = await ArtisanProfile.countDocuments({ favorites: decoded.userId });
    
    // আমাকে কে পছন্দ করেছে (আমার প্রোফাইলে যাদের আইডি favorites অ্যারেতে আছে)
    let likedByCount = 0;
    if (profile && profile.favorites) {
      likedByCount = profile.favorites.length;
    }

    const data = {
      profileStatus: profile ? profile.status : 'Not Created',
      biodataId: profile ? profile.biodataId : null,
      gender: profile ? profile.gender : 'male',
      adminFeedback: profile ? profile.adminFeedback : null,
      views: profile ? profile.views || 0 : 0,
      favorites: favoritesCount,
      likedBy: likedByCount,
      connections: connectionsCount,
      sentProposals: connectionsCount,
      receivedProposals: receivedConnectionsCount,
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching dashboard data' }, { status: 500 });
  }
}
