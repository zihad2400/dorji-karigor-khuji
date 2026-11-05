'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiBriefcase, FiMapPin, FiMail, FiPhone, FiGlobe, FiFacebook, FiUsers, FiLock, FiUnlock } from 'react-icons/fi';
import { showToast } from '@/components/ui/CustomToast';
import BackButton from '@/components/ui/BackButton';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function CompanyDetailClient({ companyId }) {
  const router = useRouter();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [buying, setBuying] = useState(false);

  const fetchCompany = async () => {
    try {
      const res = await fetch(`/api/companies/${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setCompany(data.company);
        setIsUnlocked(data.isUnlocked);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const handlePurchaseConnection = () => {
    if (!user) {
      showToast('কানেকশন কিনতে প্রথমে লগইন করুন।', 'info');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    // সরাসরি কানেকশন প্যাকেজ পেজে পাঠানো
    router.push('/connection/buy?package=basic');
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">লোড হচ্ছে...</div>;
  if (!company) return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">প্রতিষ্ঠান খুঁজে পাওয়া যায়নি।</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <BackButton href="/companies" label="সকল প্রতিষ্ঠানে ফিরে যান" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* বাম কলাম */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface rounded-2xl border border-gray-800 p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 text-primary-light flex items-center justify-center mx-auto mb-4">
                <FiBriefcase size={40} />
              </div>
              <h1 className="text-xl font-bold text-text-primary mb-1">{company.companyName}</h1>
              <p className="text-sm text-primary-light mb-4">{company.businessCategory || 'N/A'}</p>
              
              <div className="bg-background rounded-lg border border-gray-800 p-4 space-y-2 text-sm text-left">
                <div className="flex items-center gap-2 text-text-secondary"><FiMapPin /> {company.district || company.division || 'N/A'}</div>
                <div className="flex items-center gap-2 text-text-secondary"><FiUsers /> {company.numberOfEmployees || 'N/A'} জন কর্মী</div>
              </div>
            </div>

            {/* কানেকশন কার্ড */}
            <div className="bg-gradient-to-br from-primary/20 to-purple-900/20 rounded-2xl border border-primary/30 p-6">
              <h3 className="text-text-primary font-bold mb-2 flex items-center gap-2">
                <FiLock className="text-yellow-400" /> যোগাযোগের তথ্য
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                কোম্পানির সম্পূর্ণ যোগাযোগের তথ্য দেখতে কানেকশন কিনুন।
              </p>
              
              {isUnlocked ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-text-secondary mb-1">ফোন</p>
                    <p className="text-green-400 font-bold">{company.businessPhone}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-text-secondary mb-1">ইমেইল</p>
                    <p className="text-green-400 font-bold text-sm">{company.officialEmail}</p>
                  </div>
                </div>
              ) : (
                <button onClick={handlePurchaseConnection} disabled={buying} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                  {buying ? 'প্রসেস হচ্ছে...' : <><FiUnlock /> কানেকশন কিনুন (৳১০০)</>}
                </button>
              )}
            </div>
          </div>

          {/* ডান কলাম */}
          <div className="lg:col-span-2 space-y-6">
            {!isUnlocked ? (
              <div className="bg-surface rounded-2xl border border-gray-800 p-12 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-light">
                  <FiLock size={40} />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">কোম্পানির বিস্তারিত তথ্য লুকানো আছে</h2>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  কোম্পানির সম্পূর্ণ বিবরণ, কাজের ধরন এবং যোগাযোগের তথ্য দেখতে কানেকশন কিনুন।
                </p>
                <button onClick={handlePurchaseConnection} disabled={buying} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition inline-flex items-center gap-2 disabled:opacity-50">
                  {buying ? 'প্রসেস হচ্ছে...' : <><FiUnlock /> কানেকশন কিনুন (৳১০০)</>}
                </button>
              </div>
            ) : (
              <>
                <div className="bg-surface rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                    <FiBriefcase className="text-primary-light" /> প্রতিষ্ঠানের তথ্য
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed">{company.description || 'কোনো বিবরণ নেই।'}</p>
                </div>

                <div className="bg-surface rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-gray-800 pb-3">যোগাযোগ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary"><FiMail /> {company.officialEmail || 'N/A'}</div>
                    <div className="flex items-center gap-2 text-text-secondary"><FiPhone /> {company.businessPhone || 'N/A'}</div>
                    {company.website && <div className="flex items-center gap-2 text-text-secondary"><FiGlobe /> {company.website}</div>}
                    {company.facebookPage && <div className="flex items-center gap-2 text-text-secondary"><FiFacebook /> {company.facebookPage}</div>}
                  </div>
                </div>

                <div className="bg-surface rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-gray-800 pb-3">এই প্রতিষ্ঠানের চাকরি</h2>
                  <Link href="/jobs" className="text-primary-light hover:underline text-sm">সকল চাকরি দেখুন →</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
