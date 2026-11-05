import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


// নোটিফিকেশন লিস্ট আনা
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    await connectDB();

    // ফিক্সড অ্যাডমিন হলে সব নোটিফিকেশন (যা অ্যাডমিনের কাছে গেছে), নাহলে নিজের
    const query = decoded.userId === 'admin_fixed_id' 
      ? { recipient: 'admin_fixed_id' } 
      : { recipient: decoded.userId };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 });
  }
}

// নোটিফিকেশন রিড মার্ক করা
export async function PUT(req) {
  try {
    await connectDB();
    const { notificationId } = await req.json();
    
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    } else {
      // সব রিড মার্ক করা
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      const query = decoded.userId === 'admin_fixed_id' 
        ? { recipient: 'admin_fixed_id' } 
        : { recipient: decoded.userId };
        
      await Notification.updateMany(query, { isRead: true });
    }
    
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

// নোটিফিকেশন ডিলিট
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    if (notificationId) {
      await Notification.findByIdAndDelete(notificationId);
    }
    
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
