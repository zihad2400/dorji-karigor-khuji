import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'ইমেইল এবং পাসওয়ার্ড দিন' }, { status: 400 });
    }

    // === ফিক্সড অ্যাডমিন লগইন লজিক ===
    if (email === 'zihadbinsamsu2400@gmail.com' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'admin_fixed_id', role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
      );

      const cookieStore = await cookies();
      cookieStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60, // ১ দিন
        path: '/',
      });

      return NextResponse.json({
        message: 'অ্যাডমিন লগইন সফল হয়েছে',
        user: {
          id: 'admin_fixed_id',
          name: 'Super Admin',
          email: email,
          role: 'admin', // রোল অ্যাডমিন সেট করা হলো
        },
      });
    }

    // === সাধারণ ইউজার লগইন লজিক ===
    await connectDB();
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ message: 'ভুল ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return NextResponse.json({ message: 'ভুল ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      message: 'সফলভাবে লগইন হয়েছে',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: error.message || 'সার্ভার ত্রুটি' }, { status: 500 });
  }
}
