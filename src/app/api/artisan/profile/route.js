import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { generateBiodataId } from '@/lib/generateBiodataId';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'artisan') return NextResponse.json({ message: 'শুধুমাত্র কারিগররা এটি করতে পারবেন' }, { status: 403 });

    await connectDB();
    const data = await req.json();

    // ডাটা স্যানিটাইজ করা
    const sanitizedData = {
      ...data,
      expectedSalary: data.expectedSalary ? Number(data.expectedSalary) : undefined,
      maritalStatus: Array.isArray(data.maritalStatus) ? data.maritalStatus : (data.maritalStatus ? [data.maritalStatus] : []),
      bloodGroup: Array.isArray(data.bloodGroup) ? data.bloodGroup : (data.bloodGroup ? [data.bloodGroup] : []),
      educationLevels: Array.isArray(data.educationLevels) ? data.educationLevels : [],
      selectedCategories: Array.isArray(data.selectedCategories) ? data.selectedCategories : [],
    };

    // ডাটাবেসে সেভ বা আপডেট
    let profile = await ArtisanProfile.findOne({ user: decoded.userId });

    if (profile) {
      profile = await ArtisanProfile.findOneAndUpdate(
        { user: decoded.userId }, 
        { ...sanitizedData, status: 'Pending Approval' }, 
        { new: true, runValidators: true }
      );
    } else {
      const newBiodataId = await generateBiodataId(sanitizedData.gender);
      profile = await ArtisanProfile.create({
        ...sanitizedData,
        user: decoded.userId,
        biodataId: newBiodataId,
        status: 'Pending Approval',
      });
    }

    return NextResponse.json({ message: 'বায়োডাটা সাবমিট হয়েছে', profile });
  } catch (error) {
    console.error('Profile Submission Error:', error);
    // এরর মেসেজ ডিটেইল করা হলো
    return NextResponse.json({ message: `সার্ভার ত্রুটি: ${error.message}` }, { status: 500 });
  }
}
