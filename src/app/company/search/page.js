'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiUser } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

export default function CompanySearchPage() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch('/api/artisans?limit=20');
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
  }, []);

  const filtered = artisans.filter(a => 
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.primarySkill?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.biodataId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      <h1 className="text-2xl font-bold text-text-primary mb-6">কারিগর খুঁজুন</h1>

      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-3 top-3.5 text-gray-500" />
        <input 
          type="text" 
          placeholder="নাম বা দক্ষতা দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-text-primary focus:border-primary focus:outline-none"
        />
      </div>

      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : filtered.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-gray-800">
          <FiUser className="mx-auto text-4xl text-gray-600 mb-3" />
          <p className="text-text-secondary">কোনো কারিগর পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(artisan => (
            <Link key={artisan.id} href={`/artisans/${artisan.biodataId}`} className="bg-surface rounded-xl border border-gray-800 p-5 hover:border-primary transition">
              <div className="flex items-center gap-3 mb-3">
                <ProfileAvatar gender={artisan.gender} size="small" />
                <div>
                  <h3 className="text-text-primary font-bold">{artisan.fullName}</h3>
                  <p className="text-xs text-primary-light">{artisan.biodataId}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{artisan.primarySkill}</p>
              <p className="text-xs text-text-secondary mt-1">{artisan.currentDistrict || artisan.currentDivision}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
