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
    const { packageId, connectionCount, amount, paymentMethod } = await req.json();

    await connectDB();

    // পেমেন্ট সিমুলেশন
    console.log(`💰 Payment: ৳${amount} via ${paymentMethod} for ${connectionCount} connections`);

    // === কানেকশন তৈরি (টাইপ ফোর্স করে 'package' সেট করা হলো) ===
    const connection = await Connection.create({
      sender: decoded.userId,
      receiver: decoded.userId, 
      type: 'package', // এখানে সরাসরি 'package' দেওয়া হলো
      status: 'active',
      packageId: packageId || 'basic',
      connectionCount: connectionCount || 1,
      amount: amount || 0,
      paymentMethod: paymentMethod || 'bkash',
    });

    return NextResponse.json({ 
      message: 'পেমেন্ট সফল! কানেকশন অ্যাক্টিভেট হয়েছে।',
      connection 
    });
  } catch (error) {
    console.error('Buy Package Error Details:', error);
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
