import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import ArtisanProfile from '@/models/ArtisanProfile';
import CompanyProfile from '@/models/CompanyProfile';


export async function GET() {
  try {
    await connectDB();

    const totalArtisans = await User.countDocuments({ role: 'artisan' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const pendingArtisanProfiles = await ArtisanProfile.countDocuments({ status: 'Pending Approval' });
    const approvedArtisanProfiles = await ArtisanProfile.countDocuments({ status: 'Approved' });
    const pendingCompanyProfiles = await CompanyProfile.countDocuments({ status: 'Pending Approval' });
    const approvedCompanyProfiles = await CompanyProfile.countDocuments({ status: 'Approved' });

    return NextResponse.json({
      totalArtisans,
      totalCompanies,
      pendingArtisanProfiles,
      approvedArtisanProfiles,
      pendingCompanyProfiles,
      approvedCompanyProfiles,
      totalRevenue: 0,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
  }
}
