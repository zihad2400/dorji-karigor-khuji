import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs'; // bcrypt ইমপোর্ট করা হলো


export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password || !phone || !role) {
      return NextResponse.json({ message: 'সব তথ্য প্রদান করুন' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে' }, { status: 400 });
    }

    // এখানে ম্যানুয়ালি পাসওয়ার্ড হ্যাশ করা হচ্ছে
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword, // হ্যাশ করা পাসওয়ার্ড সেভ করা হচ্ছে
      phone,
      role,
    });

    return NextResponse.json(
      { message: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
