import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import CompanyProfile from '@/models/CompanyProfile';


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    await CompanyProfile.findOneAndDelete({ user: userId });
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: 'কোম্পানি ডিলিট হয়েছে' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { status } = await req.json();
    await CompanyProfile.findOneAndUpdate({ user: resolvedParams.id }, { status });
    return NextResponse.json({ message: 'স্ট্যাটাস আপডেট হয়েছে' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
