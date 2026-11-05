import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import JobApplication from '@/models/JobApplication';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function POST(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'লগইন করুন' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (err) {
      return NextResponse.json({ message: 'টোকেন মেয়াদোত্তীর্ণ, আবার লগইন করুন' }, { status: 401 });
    }

    if (decoded.role !== 'artisan') {
      return NextResponse.json({ message: 'শুধুমাত্র কারিগররা আবেদন করতে পারবেন' }, { status: 403 });
    }

    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    await connectDB();

    // চেক করা আগে থেকেই আবেদন করেছেন কিনা
    const existingApplication = await JobApplication.findOne({ 
      job: jobId, 
      artisan: decoded.userId 
    });

    if (existingApplication) {
      return NextResponse.json({ message: 'আপনি ইতিমধ্যে এই জবে আবেদন করেছেন' }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: 'জব পাওয়া যায়নি' }, { status: 404 });
    }

    // আবেদন তৈরি
    const application = await JobApplication.create({
      job: jobId,
      artisan: decoded.userId,
      status: 'Submitted',
    });

    // কোম্পানির কাছে নোটিফিকেশন
    try {
      await Notification.create({
        recipient: job.company,
        sender: decoded.userId,
        title: 'নতুন আবেদন এসেছে',
        message: `আপনার "${job.title}" জবে একটি নতুন আবেদন এসেছে।`,
        type: 'system',
        link: '/company/dashboard',
      });
    } catch (e) {
      console.log('Notification skipped');
    }

    return NextResponse.json({ message: 'আবেদন সফলভাবে জমা হয়েছে', application });
  } catch (error) {
    console.error('Apply Error:', error);
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
