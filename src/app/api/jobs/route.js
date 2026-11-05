import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';


export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;

    let query = { status: 'Published' };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query)
      .populate('company', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs API Error:', error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
