import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function DELETE(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();
    const resolvedParams = await params;

    const job = await Job.findOne({ _id: resolvedParams.id, company: decoded.userId });
    if (!job) return NextResponse.json({ message: 'জব পাওয়া যায়নি' }, { status: 404 });

    await Job.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: 'ডিলিট সফল' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
