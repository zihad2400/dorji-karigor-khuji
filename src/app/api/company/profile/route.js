import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CompanyProfile from '@/models/CompanyProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'company') return NextResponse.json({ message: 'শুধুমাত্র প্রতিষ্ঠান' }, { status: 403 });

    await connectDB();
    const data = await req.json();

    let profile = await CompanyProfile.findOne({ user: decoded.userId });
    if (profile) {
      profile = await CompanyProfile.findOneAndUpdate({ user: decoded.userId }, { ...data, status: 'Pending Approval' }, { new: true });
    } else {
      profile = await CompanyProfile.create({ ...data, user: decoded.userId, status: 'Pending Approval' });
    }

    return NextResponse.json({ message: 'প্রোফাইল সাবমিট হয়েছে', profile });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();
    const profile = await CompanyProfile.findOne({ user: decoded.userId });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
