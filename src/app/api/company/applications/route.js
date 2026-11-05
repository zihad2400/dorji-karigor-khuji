import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import JobApplication from '@/models/JobApplication';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();

    const companyJobs = await Job.find({ company: decoded.userId }).select('_id');
    const jobIds = companyJobs.map(j => j._id);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    let query = { job: { $in: jobIds } };
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .populate('artisan', 'name email phone')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { applicationId, status } = await req.json();
    await connectDB();

    const application = await JobApplication.findById(applicationId).populate('job');
    if (!application) return NextResponse.json({ message: 'আবেদন পাওয়া যায়নি' }, { status: 404 });

    const updated = await JobApplication.findByIdAndUpdate(applicationId, { status }, { new: true });

    // আর্টিজানের কাছে নোটিফিকেশন
    try {
      await Notification.create({
        recipient: application.artisan,
        sender: application.job.company,
        title: status === 'Shortlisted' ? 'আপনি শর্টলিস্টেড হয়েছেন!' : 'আবেদনের স্ট্যাটাস পরিবর্তন',
        message: `"${application.job.title}" জবে আপনার আবেদন ${status === 'Shortlisted' ? 'শর্টলিস্ট করা হয়েছে' : 'আপডেট করা হয়েছে'}`,
        type: 'system',
        link: '/artisan/dashboard',
      });
    } catch (e) {}

    return NextResponse.json({ message: 'Updated', application: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
