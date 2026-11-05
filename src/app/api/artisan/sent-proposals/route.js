import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
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

    // আপাতত কানেকশনকেই প্রস্তাব হিসেবে ধরা হচ্ছে
    const proposals = await Connection.find({ sender: decoded.userId })
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ proposals });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
