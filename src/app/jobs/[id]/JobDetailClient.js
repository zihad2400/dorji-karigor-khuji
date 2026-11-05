'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiArrowLeft, FiCheckCircle, FiLogIn } from 'react-icons/fi';
import { showToast } from '@/components/ui/CustomToast';

export default function JobDetailClient({ jobId }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!user) {
      showToast('আবেদন করতে প্রথমে লগইন করুন', 'info');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (user.role !== 'artisan') {
      showToast('শুধুমাত্র কারিগররা আবেদন করতে পারবেন', 'error');
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast('আবেদন সফলভাবে জমা হয়েছে!', 'success');
        setHasApplied(true);
      } else {
        showToast(data.message || 'আবেদন ব্যর্থ', 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">লোড হচ্ছে...</div>;
  if (!job) return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">চাকরি খুঁজে পাওয়া যায়নি।</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary-light hover:text-primary mb-6 transition">
          <FiArrowLeft /> ফিরে যান
        </button>

        <div className="bg-surface rounded-2xl border border-gray-800 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>
              <p className="text-text-secondary text-sm mt-1">{job.company?.name}</p>
            </div>
            
            {hasApplied ? (
              <div className="bg-green-500/20 text-green-400 px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                <FiCheckCircle /> আবেদন করা হয়েছে
              </div>
            ) : (
              <button onClick={handleApply} disabled={applying} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2">
                {applying ? 'আবেদন হচ্ছে...' : user ? <><FiCheckCircle /> আবেদন করুন</> : <><FiLogIn /> লগইন করে আবেদন করুন</>}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background p-3 rounded-lg flex items-center gap-2">
              <FiMapPin className="text-primary-light" />
              <div><p className="text-xs text-text-secondary">লোকেশন</p><p className="text-sm text-text-primary">{job.location || 'N/A'}</p></div>
            </div>
            <div className="bg-background p-3 rounded-lg flex items-center gap-2">
              <FiDollarSign className="text-primary-light" />
              <div><p className="text-xs text-text-secondary">বেতন</p><p className="text-sm text-text-primary">{job.salary ? `${job.salary} ৳` : 'Negotiable'}</p></div>
            </div>
            <div className="bg-background p-3 rounded-lg flex items-center gap-2">
              <FiBriefcase className="text-primary-light" />
              <div><p className="text-xs text-text-secondary">প্রয়োজন</p><p className="text-sm text-text-primary">{job.workersRequired} জন</p></div>
            </div>
            <div className="bg-background p-3 rounded-lg flex items-center gap-2">
              <FiClock className="text-primary-light" />
              <div><p className="text-xs text-text-secondary">প্রকাশ</p><p className="text-sm text-text-primary">{new Date(job.createdAt).toLocaleDateString('bn-BD')}</p></div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-lg font-semibold text-text-primary mb-2">চাকরির বিবরণ</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{job.description || 'কোনো বিবরণ নেই।'}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
