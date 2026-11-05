import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = { status: 'Approved' };
    
    if (category) {
      query.selectedCategories = category;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { biodataId: { $regex: search, $options: 'i' } },
        { skillDetails: { $regex: search, $options: 'i' } },
        { currentDistrict: { $regex: search, $options: 'i' } },
      ];
    }

    const profiles = await ArtisanProfile.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    const publicProfiles = profiles.map(profile => ({
      id: profile._id,
      biodataId: profile.biodataId,
      fullName: profile.fullName,
      primarySkill: profile.skillDetails || 'N/A',
      totalExperience: profile.totalExperience,
      currentDistrict: profile.currentDistrict,
      gender: profile.gender,
      selectedCategories: profile.selectedCategories || [],
    }));

    return NextResponse.json({ profiles: publicProfiles });
  } catch (error) {
    console.error('Artisans API Error:', error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
