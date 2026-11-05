import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';


export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'Pending Approval';
    const jobs = await Job.find({ status })
      .populate('company', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { jobId, status, adminFeedback } = await req.json();
    const updatedJob = await Job.findByIdAndUpdate(jobId, { status, adminFeedback }, { new: true });
    return NextResponse.json({ message: 'Updated', job: updatedJob });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
