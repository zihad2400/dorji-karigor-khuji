import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CompanyProfile from '@/models/CompanyProfile';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');

    let query = { status: 'Approved' };
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { businessCategory: { $regex: search, $options: 'i' } },
      ];
    }

    const companies = await CompanyProfile.find(query).sort({ createdAt: -1 }).limit(limit);

    const publicCompanies = companies.map(c => ({
      _id: c._id,
      companyName: c.companyName,
      businessCategory: c.businessCategory,
      district: c.district,
      division: c.division,
      numberOfEmployees: c.numberOfEmployees,
    }));

    return NextResponse.json({ companies: publicCompanies });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
