import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CompanyProfile from '@/models/CompanyProfile';
import Connection from '@/models/Connection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    
    // ভিউ কাউন্ট বাড়ানো
    const company = await CompanyProfile.findByIdAndUpdate(
      resolvedParams.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('user', 'name email');
    
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    // কানেকশন চেক
    let isUnlocked = false;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const connection = await Connection.findOne({
          sender: decoded.userId,
          receiver: company.user._id, // populated user এর _id
          type: 'company',
          status: 'active'
        });
        if (connection) isUnlocked = true;
      }
    } catch (e) {
      console.log('Connection check error:', e.message);
    }

    if (isUnlocked) {
      return NextResponse.json({ 
        company: company.toObject(), 
        isUnlocked: true 
      });
    } else {
      // বেসিক ডাটা (কানেকশন না কিনলে)
      const publicData = {
        _id: company._id,
        companyName: company.companyName,
        businessCategory: company.businessCategory,
        district: company.district,
        division: company.division,
        companyLogo: company.companyLogo,
        numberOfEmployees: company.numberOfEmployees,
        establishedYear: company.establishedYear,
      };
      return NextResponse.json({ 
        company: publicData, 
        isUnlocked: false 
      });
    }
  } catch (error) {
    console.error('Company Detail Error:', error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
