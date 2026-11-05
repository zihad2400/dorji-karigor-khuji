'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiBriefcase, FiUsers, FiUser, FiScissors, FiAward, FiLayers, FiFeather, FiActivity, FiStar, FiBox, FiTrendingUp, FiClock, FiDollarSign, FiZap, FiTarget, FiThumbsUp, FiHeart, FiSmile, FiSun, FiMoon, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '@/components/providers/LanguageProvider';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [artisans, setArtisans] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch('/api/artisans?limit=4');
        if (res.ok) {
          const data = await res.json();
          setArtisans(data.profiles);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingArtisans(false);
      }
    };
    fetchArtisans();
    // ক্যাটাগরি কাউন্ট ফেচ
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/categories/count');
        if (res.ok) {
          const data = await res.json();
          setCategoryCounts(data.counts || {});
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCounts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artisans?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/artisans');
    }
  };

  // নতুন ক্যাটাগরি লিস্ট (আইকন সহ)
  const categories = language === 'BN' 
    ? [
        { name: 'পাঞ্জাবি দর্জি', icon: <FiScissors /> },
        { name: 'শার্ট দর্জি', icon: <FiUser /> },
        { name: 'প্যান্ট দর্জি', icon: <FiLayers /> },
        { name: 'কাটিং মাস্টার', icon: <FiScissors /> },
        { name: 'সুইং অপারেটর', icon: <FiActivity /> },
        { name: 'এমব্রয়ডারি', icon: <FiFeather /> },
        { name: 'বুটিক ওয়ার্কার', icon: <FiStar /> },
        { name: 'কোয়ালিটি কন্ট্রোলার', icon: <FiCheckCircle /> },
        { name: 'Arabian ডিজাইন', icon: <FiTrendingUp /> },
        { name: 'ব্লেজার স্পেশালিস্ট', icon: <FiBox /> },
        { name: 'শেরওয়ানি দর্জি', icon: <FiAward /> },
        { name: 'থ্রি-পিস দর্জি', icon: <FiLayers /> },
        { name: 'কামিজ দর্জি', icon: <FiUser /> },
        { name: 'কোট দর্জি', icon: <FiBriefcase /> },
        { name: 'প্যাটার্ন মেকার', icon: <FiTarget /> },
        { name: 'ওভারলক অপারেটর', icon: <FiActivity /> },
      ]
    : [
        { name: 'Panjabi Tailor', icon: <FiScissors /> },
        { name: 'Shirt Tailor', icon: <FiUser /> },
        { name: 'Pant Tailor', icon: <FiLayers /> },
        { name: 'Cutting Master', icon: <FiScissors /> },
        { name: 'Sewing Operator', icon: <FiActivity /> },
        { name: 'Embroidery', icon: <FiFeather /> },
        { name: 'Boutique Worker', icon: <FiStar /> },
        { name: 'Quality Controller', icon: <FiCheckCircle /> },
        { name: 'Arabian Design', icon: <FiTrendingUp /> },
        { name: 'Blazer Specialist', icon: <FiBox /> },
        { name: 'Sherwani Tailor', icon: <FiAward /> },
        { name: 'Three-Piece Tailor', icon: <FiLayers /> },
        { name: 'Kameez Tailor', icon: <FiUser /> },
        { name: 'Coat Tailor', icon: <FiBriefcase /> },
        { name: 'Pattern Maker', icon: <FiTarget /> },
        { name: 'Overlock Operator', icon: <FiActivity /> },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-surface to-background py-20 lg:py-32 border-b border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              key={language}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight"
            >
              {language === 'BN' ? (
                <>বাংলাদেশের দক্ষ দর্জি ও কারিগর <br className="hidden md:block" /><span className="text-primary-light">খুঁজুন সহজেই</span></>
              ) : (
                <>Find Skilled Tailors & Artisans <br className="hidden md:block" />in Bangladesh <span className="text-primary-light">Easily</span></>
              )}
            </motion.h1>
            
            <motion.p 
              key={`sub-${language}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary mb-10 max-w-3xl mx-auto"
            >
              {language === 'BN' 
                ? 'আপনার দক্ষতার উপযুক্ত কর্মস্থল খুঁজুন, অথবা আপনার প্রতিষ্ঠানের জন্য দক্ষ কারিগর নিয়োগ করুন।'
                : 'Find the perfect workplace for your skills, or recruit skilled artisans for your organization.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            >
              <Link href="/artisans" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transform hover:scale-105">
                <FiUsers size={24} />
                {language === 'BN' ? 'কারিগর খুঁজুন' : 'Find Artisans'}
              </Link>
              <Link href="/jobs" className="bg-surfaceHover hover:bg-surfaceHover/80 border border-gray-700 text-text-primary px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 transform hover:scale-105">
                <FiBriefcase size={24} />
                {language === 'BN' ? 'কাজ খুঁজুন' : 'Find Jobs'}
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-4xl mx-auto bg-surface p-4 rounded-xl border border-gray-700 shadow-2xl flex flex-col md:flex-row gap-2"
            >
              <form onSubmit={handleSearch} className="flex-grow flex flex-col md:flex-row gap-2 w-full">
                <div className="flex-grow relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                    <FiSearch size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'BN' ? "কারিগরের নাম, দক্ষতা বা Biodata ID দিয়ে খুঁজুন..." : "Search by name, skill, or Biodata ID..."}
                    className="w-full bg-background border border-gray-700 text-text-primary rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition"
                  />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition">
                  {language === 'BN' ? 'খুঁজুন' : 'Search'}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-10">
            {language === 'BN' ? 'ক্যাটাগরি অনুযায়ী খুঁজুন' : 'Search by Category'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href={`/artisans?category=${encodeURIComponent(cat.name)}`}>
                <motion.div 
                  whileHover={{ scale: 1.05, borderColor: '#9b59b6', y: -5 }}
                  className="bg-surface p-6 rounded-xl border border-gray-800 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-light group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-text-primary font-medium text-sm group-hover:text-primary-light transition-colors">{cat.name}</span>
                  <span className="text-xs text-primary-light bg-primary/10 px-2 py-0.5 rounded-full">
                    {categoryCounts[cat.name] || 0} জন
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Live Artisan Section */}
        <section className="py-20 bg-surface border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-text-primary">
                  {language === 'BN' ? 'সাম্প্রতিক কারিগর' : 'Recent Artisans'}
                </h2>
                <p className="text-text-secondary mt-2">
                  {language === 'BN' ? 'অ্যাডমিন কর্তৃক অনুমোদিত নতুন কারিগর' : 'Newly approved artisans by admin'}
                </p>
              </div>
              <Link href="/artisans" className="text-primary-light hover:underline hidden sm:block">
                {language === 'BN' ? 'সব দেখুন →' : 'View All →'}
              </Link>
            </div>

            {loadingArtisans ? (
              <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
            ) : artisans.length === 0 ? (
              <div className="text-center py-12 text-text-secondary bg-background rounded-xl border border-gray-800">
                এখনো কোনো কারিগর অনুমোদিত হয়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {artisans.map((artisan) => (
                  <motion.div 
                    key={artisan.id}
                    whileHover={{ y: -5 }}
                    className="bg-background rounded-xl border border-gray-800 p-6 flex flex-col items-center text-center shadow-lg"
                  >
                    <div className="mb-4">
                      <ProfileAvatar gender={artisan.gender} size="medium" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">{artisan.fullName}</h3>
                    <p className="text-primary-light text-sm font-medium mb-2">{artisan.biodataId}</p>
                    <p className="text-text-secondary text-sm mb-1">{artisan.primarySkill}</p>
                    <p className="text-text-secondary text-xs mb-4">{artisan.currentDistrict || artisan.currentDivision}</p>
                    
                    <Link 
                      href={`/artisans/${artisan.biodataId}`} 
                      className="w-full bg-surfaceHover hover:bg-gray-700 text-text-primary py-2 rounded-lg text-sm font-medium transition border border-gray-700 mt-auto"
                    >
                      {language === 'BN' ? 'প্রোফাইল দেখুন' : 'View Profile'}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/artisans" className="text-primary-light hover:underline">
                {language === 'BN' ? 'সব কারিগর দেখুন →' : 'View All Artisans →'}
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-12">
              {language === 'BN' ? 'কীভাবে কাজ করে?' : 'How It Works?'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">১</div>
                <h3 className="text-xl text-text-primary font-semibold mb-2">{language === 'BN' ? 'রেজিস্ট্রেশন করুন' : 'Register'}</h3>
                <p className="text-text-secondary">{language === 'BN' ? 'কারিগর বা প্রতিষ্ঠান হিসেবে অ্যাকাউন্ট খুলুন।' : 'Create an account as an artisan or a company.'}</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">২</div>
                <h3 className="text-xl text-text-primary font-semibold mb-2">{language === 'BN' ? 'প্রোফাইল তৈরি করুন' : 'Create Profile'}</h3>
                <p className="text-text-secondary">{language === 'BN' ? 'বিস্তারিত বায়োডাটা বা কোম্পানি প্রোফাইল তৈরি করুন।' : 'Create a detailed biodata or company profile.'}</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">৩</div>
                <h3 className="text-xl text-text-primary font-semibold mb-2">{language === 'BN' ? 'সংযোগ করুন' : 'Connect'}</h3>
                <p className="text-text-secondary">{language === 'BN' ? 'কানেকশন কিনে সরাসরি যোগাযোগ করুন।' : 'Purchase a connection to contact directly.'}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
