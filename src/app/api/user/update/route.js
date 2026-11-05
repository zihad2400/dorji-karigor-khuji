import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.userId === 'admin_fixed_id') {
      return NextResponse.json({ message: 'ফিক্সড অ্যাডমিনের তথ্য পরিবর্তন করা যাবে না' }, { status: 403 });
    }

    await connectDB();
    const { name, email, phone, currentPassword, newPassword } = await req.json();

    const user = await User.findById(decoded.userId).select('+password');
    if (!user) return NextResponse.json({ message: 'ইউজার পাওয়া যায়নি' }, { status: 404 });

    // পাসওয়ার্ড পরিবর্তন
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'বর্তমান পাসওয়ার্ড দিন' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'বর্তমান পাসওয়ার্ড ভুল' }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // সাধারণ তথ্য আপডেট
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return NextResponse.json({ message: 'এই ইমেইল আগে থেকেই ব্যবহৃত হচ্ছে' }, { status: 400 });
      user.email = email;
    }

    await user.save();
    return NextResponse.json({ message: 'তথ্য সফলভাবে আপডেট হয়েছে' });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
