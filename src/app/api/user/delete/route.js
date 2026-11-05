import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import ArtisanProfile from '@/models/ArtisanProfile';
import CompanyProfile from '@/models/CompanyProfile';
import Connection from '@/models/Connection';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.userId === 'admin_fixed_id') {
      return NextResponse.json({ message: 'অ্যাডমিন অ্যাকাউন্ট ডিলিট করা যাবে না' }, { status: 403 });
    }

    await connectDB();

    // ইউজারের রোল চেক করা
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: 'ইউজার পাওয়া যায়নি' }, { status: 404 });

    // relacioneted প্রোফাইল ডিলিট
    if (user.role === 'artisan') {
      await ArtisanProfile.findOneAndDelete({ user: user._id });
    } else if (user.role === 'company') {
      await CompanyProfile.findOneAndDelete({ user: user._id });
    }

    // কানেকশন ডিলিট
    await Connection.deleteMany({ $or: [{ sender: user._id }, { receiver: user._id }] });

    // নোটিফিকেশন ডিলিট
    await Notification.deleteMany({ recipient: user._id });

    // মূল ইউজার ডিলিট
    await User.findByIdAndDelete(user._id);

    // কুকি ক্লিয়ার
    cookieStore.delete('token');

    return NextResponse.json({ message: 'অ্যাকাউন্ট সফলভাবে ডিলিট হয়েছে' });
  } catch (error) {
    console.error('Account Delete Error:', error);
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
