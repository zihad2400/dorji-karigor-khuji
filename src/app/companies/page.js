'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FiBriefcase, FiMapPin, FiSearch, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

function CompaniesContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        const res = await fetch(`/api/companies?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.companies || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {searchQuery ? `সার্চ: "${searchQuery}"` : 'সকল প্রতিষ্ঠান'}
          </h1>
          <p className="text-text-secondary">
            {loading ? 'লোড হচ্ছে...' : `${companies.length} টি প্রতিষ্ঠান পাওয়া গেছে`}
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/companies?search=${encodeURIComponent(localSearch)}`; }} className="w-full md:w-72 relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-500" />
          <input 
            type="text" 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="প্রতিষ্ঠান খুঁজুন..."
            className="w-full bg-surface border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-gray-800">
          <FiBriefcase className="mx-auto text-4xl text-gray-600 mb-4" />
          <p className="text-text-secondary">কোনো প্রতিষ্ঠান পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <motion.div 
              key={company._id}
              whileHover={{ y: -5 }}
              className="bg-surface rounded-xl border border-gray-800 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
                  <FiBriefcase size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{company.companyName}</h3>
                  <p className="text-xs text-text-secondary">{company.businessCategory || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                <FiMapPin /> {company.district || company.division || 'N/A'}
              </div>
              
              <Link href={`/companies/${company._id}`} className="block w-full text-center bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                <FiLock size={14} /> কানেকশন কিনে দেখুন
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>}>
          <CompaniesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
