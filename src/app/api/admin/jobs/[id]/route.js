import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    await Job.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ message: 'জব ডিলিট হয়েছে' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { status } = await req.json();
    await Job.findByIdAndUpdate(resolvedParams.id, { status });
    return NextResponse.json({ message: 'স্ট্যাটাস আপডেট হয়েছে' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
