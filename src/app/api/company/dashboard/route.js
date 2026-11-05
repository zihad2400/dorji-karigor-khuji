import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import JobApplication from '@/models/JobApplication';
import CompanyProfile from '@/models/CompanyProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'company') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    await connectDB();

    const activeJobs = await Job.countDocuments({ company: decoded.userId, status: 'Published' });
    const companyJobs = await Job.find({ company: decoded.userId }).select('_id');
    const jobIds = companyJobs.map(j => j._id);

    const totalApplications = await JobApplication.countDocuments({ job: { $in: jobIds } });
    const shortlistedCount = await JobApplication.countDocuments({ job: { $in: jobIds }, status: 'Shortlisted' });

    const companyProfile = await CompanyProfile.findOne({ user: decoded.userId });
    const profileViews = companyProfile ? companyProfile.views || 0 : 0;

    const recentApplications = await JobApplication.find({ job: { $in: jobIds } })
      .populate('artisan', 'name email')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      activeJobs,
      totalApplications,
      shortlistedCount,
      profileViews,
      recentApplications: recentApplications.map(app => ({
        id: app._id,
        artisanName: app.artisan?.name || 'N/A',
        jobTitle: app.job?.title || 'N/A',
        status: app.status,
        date: app.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
