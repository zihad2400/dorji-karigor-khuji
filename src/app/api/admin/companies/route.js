import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CompanyProfile from '@/models/CompanyProfile';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'Pending Approval';
    const companies = await CompanyProfile.find({ status }).populate('user', 'name email').sort({ createdAt: -1 });
    return NextResponse.json({ companies });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { companyId, status, adminFeedback } = await req.json();
    const updatedCompany = await CompanyProfile.findByIdAndUpdate(companyId, { status, adminFeedback }, { new: true });
    return NextResponse.json({ message: 'Updated', company: updatedCompany });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
