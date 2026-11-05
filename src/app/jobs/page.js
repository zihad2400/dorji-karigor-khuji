'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

function JobsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {search ? `সার্চ: "${search}"` : 'সকল চাকরি'}
        </h1>
        <p className="text-text-secondary">
          {loading ? 'লোড হচ্ছে...' : `${jobs.length} টি চাকরি পাওয়া গেছে`}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-gray-800">
          <FiBriefcase className="mx-auto text-4xl text-gray-600 mb-4" />
          <p className="text-text-secondary">কোনো চাকরি পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <motion.div 
              key={job._id}
              whileHover={{ y: -5 }}
              className="bg-surface rounded-xl border border-gray-800 p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-text-primary">{job.title}</h3>
                <span className="text-xs bg-primary/20 text-primary-light px-2 py-1 rounded">#{job.category || 'N/A'}</span>
              </div>
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">{job.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mb-4">
                <div className="flex items-center gap-1"><FiMapPin /> {job.location || 'N/A'}</div>
                <div className="flex items-center gap-1"><FiDollarSign /> {job.salary ? `${job.salary} ৳` : 'Negotiable'}</div>
                <div className="flex items-center gap-1"><FiBriefcase /> {job.workersRequired} জন</div>
                <div className="flex items-center gap-1"><FiClock /> {new Date(job.createdAt).toLocaleDateString('bn-BD')}</div>
              </div>
              <Link href={`/jobs/${job._id}`} className="block w-full text-center bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-medium transition">
                বিস্তারিত দেখুন
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>}>
          <JobsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
