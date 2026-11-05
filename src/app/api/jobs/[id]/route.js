import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const job = await Job.findById(resolvedParams.id).populate('company', 'name email');
    
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
