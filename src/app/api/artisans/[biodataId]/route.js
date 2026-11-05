import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import Connection from '@/models/Connection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { biodataId } = resolvedParams;

    const profile = await ArtisanProfile.findOne({ biodataId, status: 'Approved' })
      .populate('user', 'name email');

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    let isUnlocked = false;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        const connection = await Connection.findOne({
          sender: decoded.userId,
          receiver: profile.user._id,
          type: 'artisan',
          status: 'active'
        });
        
        if (connection) isUnlocked = true;
      }
    } catch (e) {}

    const responseData = profile.toObject();

    if (!isUnlocked) {
      responseData.mobileNumber = 'কানেকশন কিনুন';
      if (responseData.user) {
        responseData.user.email = 'কানেকশন কিনুন';
      }
    }

    return NextResponse.json({ profile: responseData, isUnlocked });
  } catch (error) {
    console.error('Artisan Profile API Error:', error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}
