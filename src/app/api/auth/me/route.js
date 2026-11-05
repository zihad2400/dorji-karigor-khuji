import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // ফিক্সড অ্যাডমিন চেক
    if (decoded.userId === 'admin_fixed_id') {
      return NextResponse.json({
        user: {
          id: 'admin_fixed_id',
          name: 'Super Admin',
          email: 'zihadbinsamsu2400@gmail.com',
          phone: '01700000000',
          role: 'admin',
        }
      });
    }

    // সাধারণ ইউজার
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
