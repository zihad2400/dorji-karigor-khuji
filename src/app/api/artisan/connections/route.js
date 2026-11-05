import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

    const connections = await Connection.find({ sender: decoded.userId })
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ connections });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
