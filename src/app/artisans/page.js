'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FiUser, FiSearch } from 'react-icons/fi';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { motion } from 'framer-motion';

function ArtisansContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        
        const res = await fetch(`/api/artisans?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setArtisans(data.profiles || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/artisans?search=${encodeURIComponent(localSearch.trim())}`;
    } else {
      window.location.href = '/artisans';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {category ? `${category} - কারিগর` : search ? `সার্চ: "${search}"` : 'সকল কারিগর'}
          </h1>
          <p className="text-text-secondary">
            {loading ? 'লোড হচ্ছে...' : `${artisans.length} জন কারিগর পাওয়া গেছে`}
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-72 relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-500" />
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="কারিগর খুঁজুন..."
            className="w-full bg-surface border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>
      ) : artisans.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-gray-800">
          <FiSearch className="mx-auto text-4xl text-gray-600 mb-4" />
          <p className="text-text-secondary">কোনো কারিগর পাওয়া যায়নি।</p>
          {(category || search) && (
            <Link href="/artisans" className="text-primary-light hover:underline mt-4 inline-block">
              সব কারিগর দেখুন →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artisans.map((artisan) => (
            <motion.div 
              key={artisan.id}
              whileHover={{ y: -5 }}
              className="bg-surface rounded-xl border border-gray-800 p-6 flex flex-col items-center text-center shadow-lg"
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
                প্রোফাইল দেখুন
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArtisansPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>}>
          <ArtisansContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
