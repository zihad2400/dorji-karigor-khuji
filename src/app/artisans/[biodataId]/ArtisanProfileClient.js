'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { FiUser, FiMapPin, FiBriefcase, FiLock, FiUnlock, FiHeart, FiShare2, FiAward, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { showToast } from '@/components/ui/CustomToast';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

export default function ArtisanProfileClient({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const resolvedParams = use(params);
  const biodataId = resolvedParams.biodataId;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/artisans/${biodataId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          if (user && data.profile.favorites?.includes(user.id)) {
             setIsLiked(true);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [biodataId, user]);

  const handleLike = async () => {
    if (!user) {
      showToast('পছন্দ করতে প্রথমে লগইন করুন।', 'info');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    
    try {
      const res = await fetch('/api/artisan/toggle-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile._id })
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.liked);
        showToast(data.liked ? 'পছন্দের তালিকায় যুক্ত হয়েছে!' : 'পছন্দের তালিকা থেকে সরানো হয়েছে।', data.liked ? 'success' : 'info');
      }
    } catch (error) {
      showToast('সমস্যা হয়েছে', 'error');
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.fullName} - ${profile.biodataId}`, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('লিঙ্ক কপি হয়েছে!', 'success');
      }
    } catch (error) {
      await navigator.clipboard.writeText(shareUrl);
      showToast('লিঙ্ক কপি হয়েছে!', 'success');
    }
  };

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
  if (!profile) return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">বায়োডাটা খুঁজে পাওয়া যায়নি।</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/30 to-purple-600/30"></div>
              
              <div className="mt-4">
                <ProfileAvatar gender={profile.gender} size="large" />
              </div>
              
              <p className="text-text-secondary text-sm mt-4 mb-1">বায়োডাটা নং</p>
              <h1 className="text-2xl font-bold text-text-primary mb-2">{profile.biodataId}</h1>
              <h2 className="text-xl font-semibold text-primary-light mb-4">{profile.fullName}</h2>
              
              <div className="w-full bg-background rounded-xl border border-gray-800 p-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">প্রধান দক্ষতা</span>
                  <span className="text-text-primary font-medium">{profile.skillDetails || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">অভিজ্ঞতা</span>
                  <span className="text-text-primary font-medium">{profile.totalExperience || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">ঠিকানা</span>
                  <span className="text-text-primary font-medium">{profile.currentDistrict || profile.currentDivision || 'N/A'}</span>
                </div>
              </div>

              <div className="w-full flex gap-2">
                <button onClick={handleLike} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-medium ${isLiked ? 'bg-pink-500/20 border border-pink-500 text-pink-400' : 'bg-surfaceHover border border-gray-700 hover:bg-gray-700 text-text-primary'}`}>
                  <FiHeart fill={isLiked ? 'currentColor' : 'none'} /> {isLiked ? 'পছন্দ হয়েছে' : 'পছন্দ'}
                </button>
                <button onClick={handleShare} className="flex-1 bg-surfaceHover border border-gray-700 hover:bg-gray-700 text-text-primary py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm font-medium">
                  <FiShare2 /> শেয়ার
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-primary/20 to-purple-900/20 rounded-2xl border border-primary/30 p-6">
              <h3 className="text-text-primary font-bold mb-2 flex items-center gap-2">
                <FiLock className="text-yellow-400" /> যোগাযোগের তথ্য
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                এই কারিগরের সম্পূর্ণ তথ্য এবং মোবাইল নম্বর দেখতে কানেকশন কিনুন।
              </p>
              
              {isUnlocked ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-text-secondary mb-1">মোবাইল</p>
                    <p className="text-green-400 font-bold">{profile.mobileNumber}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-xs text-text-secondary mb-1">ইমেইল</p>
                    <p className="text-green-400 font-bold text-sm">{profile.user?.email}</p>
                  </div>
                </div>
              ) : (
                <button onClick={handlePurchaseConnection} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
                  <FiUnlock /> কানেকশন কিনুন (৳১০০)
                </button>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <FiUser className="text-primary-light" /> ব্যক্তিগত তথ্য
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-text-secondary block mb-1">পূর্ণ নাম</span> <span className="text-text-primary font-medium">{profile.fullName}</span></div>
                <div><span className="text-text-secondary block mb-1">জন্ম তারিখ</span> <span className="text-text-primary">{profile.dob ? new Date(profile.dob).toLocaleDateString('bn-BD') : 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">লিঙ্গ</span> <span className="text-text-primary">{profile.gender === 'female' ? 'মহিলা' : profile.gender === 'male' ? 'পুরুষ' : 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">ধর্ম</span> <span className="text-text-primary">{profile.religion || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">রক্তের গ্রুপ</span> <span className="text-text-primary">{profile.bloodGroup?.join(', ') || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">বৈবাহিক অবস্থা</span> <span className="text-text-primary">{profile.maritalStatus?.join(', ') || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">উচ্চতা</span> <span className="text-text-primary">{profile.height || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">ওজন</span> <span className="text-text-primary">{profile.weight || 'N/A'}</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <FiAward className="text-primary-light" /> দক্ষতা ও এক্সপার্টাইজ
              </h2>
              
              <div className="mb-4">
                <span className="text-text-secondary block mb-2 text-sm">নির্বাচিত কাজের ক্যাটাগরি</span>
                <div className="flex flex-wrap gap-2">
                  {profile.selectedCategories && profile.selectedCategories.length > 0 ? (
                    profile.selectedCategories.map((cat, index) => (
                      <span key={index} className="bg-primary/10 text-primary-light border border-primary/30 px-3 py-1 rounded-full text-sm">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-secondary text-sm">কোনো ক্যাটাগরি নির্বাচন করা হয়নি।</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-gray-800">
                <div className="md:col-span-2"><span className="text-text-secondary block mb-1">দক্ষতার বিস্তারিত</span> <span className="text-text-primary">{profile.skillDetails || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">মোট অভিজ্ঞতা</span> <span className="text-text-primary">{profile.totalExperience || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">মেশিন অভিজ্ঞতা</span> <span className="text-text-primary">{profile.machineExperience || 'N/A'}</span></div>
                <div><span className="text-text-secondary block mb-1">প্রোডাকশন ক্যাপাসিটি</span> <span className="text-text-primary">{profile.productionCapacity || 'N/A'}</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <FiMapPin className="text-primary-light" /> ঠিকানার তথ্য
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-text-secondary block mb-1">স্থায়ী ঠিকানা</span> <span className="text-text-primary">{profile.permanentDivision}, {profile.permanentDistrict}</span></div>
                <div><span className="text-text-secondary block mb-1">বর্তমান ঠিকানা</span> <span className="text-text-primary">{profile.currentDivision}, {profile.currentDistrict}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
