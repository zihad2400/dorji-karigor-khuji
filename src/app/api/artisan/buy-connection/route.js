import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const { receiverId } = await req.json();

    await connectDB();

    // চেক করা আগে থেকেই কানেকশন আছে কিনা
    const existing = await Connection.findOne({ sender: decoded.userId, receiver: receiverId });
    if (existing) return NextResponse.json({ message: 'আপনি ইতিমধ্যে এই ইউজারের কানেকশন কিনেছেন' }, { status: 400 });

    await Connection.create({
      sender: decoded.userId,
      receiver: receiverId,
      status: 'active',
    });

    return NextResponse.json({ message: 'কানেকশন সফলভাবে কেনা হয়েছে!' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
