import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import CompanyProfile from '@/models/CompanyProfile';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'কানেকশন কিনতে প্রথমে লগইন করুন' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (err) {
      return NextResponse.json({ message: 'টোকেন মেয়াদোত্তীর্ণ, আবার লগইন করুন' }, { status: 401 });
    }

    const { companyId } = await req.json();
    if (!companyId) {
      return NextResponse.json({ message: 'কোম্পানি আইডি প্রয়োজন' }, { status: 400 });
    }

    await connectDB();

    // কোম্পানির প্রোফাইল খুঁজে বের করা
    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      return NextResponse.json({ message: 'কোম্পানি পাওয়া যায়নি' }, { status: 404 });
    }

    // === গুরুত্বপূর্ণ: user আইডিকে ObjectId-তে কনভার্ট করা ===
    let receiverId;
    try {
      receiverId = new mongoose.Types.ObjectId(company.user.toString());
    } catch (e) {
      return NextResponse.json({ message: 'কোম্পানির ইউজার আইডি সঠিক নয়' }, { status: 400 });
    }

    // আগে থেকে কানেকশন আছে কিনা চেক
    const existing = await Connection.findOne({ 
      sender: decoded.userId, 
      receiver: receiverId,
      type: 'company'
    });

    if (existing) {
      return NextResponse.json({ 
        message: 'আপনি ইতিমধ্যে এই কোম্পানির কানেকশন কিনেছেন', 
        isUnlocked: true 
      }, { status: 200 });
    }

    // নতুন কানেকশন তৈরি
    const newConnection = await Connection.create({
      sender: decoded.userId,
      receiver: receiverId,
      type: 'company',
      status: 'active',
    });

    console.log(`✅ Connection created: ${decoded.userId} → ${receiverId}`);

    return NextResponse.json({ 
      message: 'কানেকশন সফলভাবে কেনা হয়েছে!', 
      isUnlocked: true 
    });
  } catch (error) {
    console.error('❌ Buy Connection Error Details:', error);
    return NextResponse.json({ 
      message: 'সার্ভার ত্রুটি: ' + (error.message || 'অজানা সমস্যা') 
    }, { status: 500 });
  }
}
