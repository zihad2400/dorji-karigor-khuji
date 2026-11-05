import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import Notification from '@/models/Notification';
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

    const jobs = await Job.find({ company: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'company') {
      return NextResponse.json({ message: 'শুধুমাত্র প্রতিষ্ঠান জব পোস্ট করতে পারবে' }, { status: 403 });
    }

    await connectDB();
    const data = await req.json();

    if (!data.title || !data.category || !data.workersRequired || !data.description) {
      return NextResponse.json({ message: 'সব প্রয়োজনীয় তথ্য দিন' }, { status: 400 });
    }

    const job = await Job.create({
      ...data,
      company: decoded.userId,
      status: 'Pending Approval', // ডিফল্ট: Pending Approval
    });

    // অ্যাডমিনের কাছে নোটিফিকেশন
    try {
      await Notification.create({
        recipient: 'admin_fixed_id',
        sender: decoded.userId,
        title: 'নতুন জব পোস্ট সাবমিট হয়েছে',
        message: `${job.title} জবটি অনুমোদনের জন্য পাঠানো হয়েছে।`,
        type: 'system',
        link: '/admin/dashboard',
      });
    } catch (e) {
      console.log('Notification skipped');
    }

    return NextResponse.json({ message: 'জব পোস্ট সাবমিট হয়েছে', job });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
