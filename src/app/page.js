'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiBriefcase, FiUsers, FiMapPin, FiLock, FiDollarSign, FiClock } from 'react-icons/fi';
import { useLanguage } from '@/components/providers/LanguageProvider';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [artisans, setArtisans] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artisanRes, companyRes, jobRes] = await Promise.all([
          fetch('/api/artisans?limit=4'),
          fetch('/api/companies?limit=4'),
          fetch('/api/jobs?limit=4') // লাইভ জব লোড
        ]);
        
        if (artisanRes.ok) {
          const data = await artisanRes.json();
          setArtisans(data.profiles || []);
        }
        if (companyRes.ok) {
          const data = await companyRes.json();
          setCompanies(data.companies || []);
        }
        if (jobRes.ok) {
          const data = await jobRes.json();
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artisans?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/artisans');
    }
  };

  const categories = language === 'BN' 
    ? ['পাঞ্জাবি দর্জি', 'শার্ট দর্জি', 'প্যান্ট দর্জি', 'কাটিং মাস্টার', 'সুইং অপারেটর', 'এমব্রয়ডারি', 'বুটিক ওয়ার্কার', 'কোয়ালিটি কন্ট্রোলার']
    : ['Panjabi Tailor', 'Shirt Tailor', 'Pant Tailor', 'Cutting Master', 'Sewing Operator', 'Embroidery', 'Boutique Worker', 'Quality Controller'];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-surface to-background py-12 sm:py-16 lg:py-24 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight"
            >
              {language === 'BN' ? (
                <>বাংলাদেশের দক্ষ দর্জি ও কারিগর <br className="hidden sm:block" /><span className="text-primary-light">খুঁজুন সহজেই</span></>
              ) : (
                <>Find Skilled Tailors & Artisans <br className="hidden sm:block" />in Bangladesh <span className="text-primary-light">Easily</span></>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-10 max-w-3xl mx-auto px-2"
            >
              {language === 'BN' 
                ? 'আপনার দক্ষতার উপযুক্ত কর্মস্থল খুঁজুন, অথবা আপনার প্রতিষ্ঠানের জন্য দক্ষ কারিগর নিয়োগ করুন।'
                : 'Find the perfect workplace for your skills, or recruit skilled artisans for your organization.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-16 px-4"
            >
              <Link href="/artisans" className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <FiUsers size={20} className="sm:w-6 sm:h-6" />
                {language === 'BN' ? 'কারিগর খুঁজুন' : 'Find Artisans'}
              </Link>
              <Link href="/jobs" className="bg-surfaceHover hover:bg-surfaceHover/80 border border-gray-700 text-text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition flex items-center justify-center gap-2">
                <FiBriefcase size={20} className="sm:w-6 sm:h-6" />
                {language === 'BN' ? 'কাজ খুঁজুন' : 'Find Jobs'}
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-4xl mx-auto bg-surface p-3 sm:p-4 rounded-xl border border-gray-700 shadow-2xl"
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="flex-grow relative w-full">
                  <FiSearch className="absolute inset-y-0 left-3 sm:left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'BN' ? "নাম, দক্ষতা বা Biodata ID..." : "Name, skill, or Biodata ID..."}
                    className="w-full bg-background border border-gray-700 text-text-primary rounded-lg py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm sm:text-base focus:outline-none focus:border-primary transition"
                  />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition">
                  {language === 'BN' ? 'খুঁজুন' : 'Search'}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6 sm:mb-10 text-center">
            {language === 'BN' ? 'ক্যাটাগরি অনুযায়ী খুঁজুন' : 'Search by Category'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href={`/artisans?category=${encodeURIComponent(cat)}`}>
                <motion.div 
                  whileHover={{ scale: 1.05, borderColor: '#9b59b6' }}
                  className="bg-surface p-4 sm:p-6 rounded-xl border border-gray-800 transition cursor-pointer h-full flex items-center justify-center text-center"
                >
                  <span className="text-text-primary font-medium text-xs sm:text-sm">{cat}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Artisans */}
        <section className="py-12 sm:py-16 lg:py-20 bg-surface border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {language === 'BN' ? 'সাম্প্রতিক কারিগর' : 'Recent Artisans'}
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  {language === 'BN' ? 'অ্যাডমিন কর্তৃক অনুমোদিত' : 'Approved by admin'}
                </p>
              </div>
              <Link href="/artisans" className="text-primary-light hover:underline text-sm">
                {language === 'BN' ? 'সব দেখুন →' : 'View All →'}
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
            ) : artisans.length === 0 ? (
              <div className="text-center py-12 text-text-secondary bg-background rounded-xl border border-gray-800">
                এখনো কোনো কারিগর অনুমোদিত হয়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {artisans.map((artisan) => (
                  <Link key={artisan.id} href={`/artisans/${artisan.biodataId}`}>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-background rounded-xl border border-gray-800 p-5 sm:p-6 flex flex-col items-center text-center shadow-lg h-full"
                    >
                      <div className="mb-3 sm:mb-4">
                        <ProfileAvatar gender={artisan.gender} size="medium" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-text-primary mb-1">{artisan.fullName}</h3>
                      <p className="text-primary-light text-xs sm:text-sm font-medium mb-2">{artisan.biodataId}</p>
                      <p className="text-text-secondary text-xs sm:text-sm mb-1">{artisan.primarySkill}</p>
                      <p className="text-text-secondary text-xs">{artisan.currentDistrict}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== নতুন সেকশন: সাম্প্রতিক চাকরি (Recent Jobs) ===== */}
        <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                {language === 'BN' ? 'সাম্প্রতিক চাকরি' : 'Recent Jobs'}
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {language === 'BN' ? 'নতুন চাকরির বিজ্ঞাপনসমূহ' : 'Latest job circulars'}
              </p>
            </div>
            <Link href="/jobs" className="text-primary-light hover:underline text-sm">
              {language === 'BN' ? 'সব দেখুন →' : 'View All →'}
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-text-secondary bg-surface rounded-xl border border-gray-800">
              এখনো কোনো চাকরি প্রকাশিত হয়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {jobs.map((job) => (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-surface rounded-xl border border-gray-800 p-5 flex flex-col h-full hover:border-primary transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-text-primary line-clamp-2 flex-grow">
                        {job.title}
                      </h3>
                      <span className="text-[9px] bg-primary/20 text-primary-light px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                        LIVE
                      </span>
                    </div>
                    
                    <div className="text-xs text-text-secondary space-y-1.5 mb-4 flex-grow">
                      <p className="flex items-center gap-1 truncate">
                        <FiBriefcase size={11} className="flex-shrink-0" /> 
                        {job.company?.name || 'N/A'}
                      </p>
                      <p className="flex items-center gap-1">
                        <FiMapPin size={11} className="flex-shrink-0" /> 
                        {job.location || 'N/A'}
                      </p>
                      <p className="flex items-center gap-1">
                        <FiDollarSign size={11} className="flex-shrink-0" /> 
                        {job.salary ? `${job.salary} ৳` : 'Negotiable'}
                      </p>
                      <p className="flex items-center gap-1">
                        <FiUsers size={11} className="flex-shrink-0" /> 
                        {job.workersRequired} জন প্রয়োজন
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-gray-800 text-xs text-primary-light flex items-center justify-center gap-1">
                      <FiClock size={11} /> বিস্তারিত দেখুন
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Verified Companies */}
        <section className="py-12 sm:py-16 lg:py-20 bg-surface border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {language === 'BN' ? 'অনুমোদিত প্রতিষ্ঠান' : 'Verified Companies'}
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  {language === 'BN' ? 'কানেকশন কিনে তথ্য দেখুন' : 'Purchase connection to see details'}
                </p>
              </div>
              <Link href="/companies" className="text-primary-light hover:underline text-sm">
                {language === 'BN' ? 'সব দেখুন →' : 'View All →'}
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
            ) : companies.length === 0 ? (
              <div className="text-center py-12 text-text-secondary bg-background rounded-xl border border-gray-800">
                এখনো কোনো প্রতিষ্ঠান অনুমোদিত হয়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {companies.map((company) => (
                  <Link key={company._id} href={`/companies/${company._id}`}>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-background rounded-xl border border-gray-800 p-5 flex flex-col h-full"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-light flex-shrink-0">
                          <FiBriefcase size={20} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold text-text-primary truncate">{company.companyName}</h3>
                            <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">LIVE</span>
                          </div>
                          <p className="text-xs text-primary-light">#{company._id.slice(-6)}</p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-text-secondary space-y-1 mb-3">
                        <p className="flex items-center gap-1 truncate"><FiBriefcase size={11} /> {company.businessCategory || 'N/A'}</p>
                        <p className="flex items-center gap-1 truncate"><FiMapPin size={11} /> {company.district || company.division || 'N/A'}</p>
                      </div>
                      
                      <div className="mt-auto pt-3 border-t border-gray-800 text-xs text-primary-light flex items-center justify-center gap-1">
                        <FiLock size={11} /> কানেকশন কিনুন
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 sm:mb-12 text-center">
            {language === 'BN' ? 'কীভাবে কাজ করে?' : 'How It Works?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { num: '১', title: language === 'BN' ? 'রেজিস্ট্রেশন করুন' : 'Register', desc: language === 'BN' ? 'কারিগর বা প্রতিষ্ঠান হিসেবে অ্যাকাউন্ট খুলুন।' : 'Create an account as an artisan or company.' },
              { num: '২', title: language === 'BN' ? 'প্রোফাইল তৈরি করুন' : 'Create Profile', desc: language === 'BN' ? 'বিস্তারিত বায়োডাটা বা কোম্পানি প্রোফাইল তৈরি করুন।' : 'Create a detailed biodata or company profile.' },
              { num: '৩', title: language === 'BN' ? 'সংযোগ করুন' : 'Connect', desc: language === 'BN' ? 'কানেকশন কিনে সরাসরি যোগাযোগ করুন।' : 'Purchase a connection to contact directly.' },
            ].map((item, i) => (
              <div key={i} className="p-4 sm:p-6 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold">
                  {item.num}
                </div>
                <h3 className="text-lg sm:text-xl text-text-primary font-semibold mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
