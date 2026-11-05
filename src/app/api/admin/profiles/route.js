import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ArtisanProfile from '@/models/ArtisanProfile';
import Notification from '@/models/Notification';


export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'Pending Approval';

    const profiles = await ArtisanProfile.find({ status })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching profiles' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { profileId, status, adminFeedback } = await req.json();

    if (!profileId || !status) {
      return NextResponse.json({ message: 'প্রোফাইল আইডি এবং স্ট্যাটাস প্রয়োজন' }, { status: 400 });
    }

    // প্রোফাইল আপডেট
    const updateData = { status };
    if (adminFeedback) updateData.adminFeedback = adminFeedback;

    const updatedProfile = await ArtisanProfile.findByIdAndUpdate(
      profileId, 
      updateData, 
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ message: 'প্রোফাইল পাওয়া যায়নি' }, { status: 404 });
    }

    // === নোটিফিকেশন তৈরি (যদি সম্ভব হয়) ===
    try {
      // চেক করা user আইডি সঠিক কিনা
      if (updatedProfile.user && updatedProfile.user.toString() !== 'admin_fixed_id') {
        const isApproved = status === 'Approved';
        
        await Notification.create({
          recipient: updatedProfile.user,
          sender: null, // অ্যাডমিনের জন্য null
          title: isApproved ? 'আপনার বায়োডাটা অনুমোদিত হয়েছে' : 'আপনার বায়োডাটা রিজেক্ট হয়েছে',
          message: isApproved 
            ? `আপনার বায়োডাটা (${updatedProfile.biodataId}) সফলভাবে অনুমোদিত হয়েছে এবং ওয়েবসাইটে লাইভ হয়েছে।` 
            : `আপনার বায়োডাটা (${updatedProfile.biodataId}) রিজেক্ট হয়েছে। কারণ: ${adminFeedback || 'তথ্য সম্পূর্ণ নয়'}`,
          type: isApproved ? 'biodata_approved' : 'biodata_rejected',
          link: '/artisan/dashboard',
        });
      }
    } catch (notifError) {
      // নোটিফিকেশন ব্যর্থ হলেও অ্যাপ্রুভাল প্রসেস চলবে
      console.error('Notification failed:', notifError.message);
    }

    return NextResponse.json({ 
      message: `${status === 'Approved' ? 'অনুমোদিত' : 'রিজেক্টেড'} হয়েছে`, 
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ message: `ত্রুটি: ${error.message}` }, { status: 500 });
  }
}
