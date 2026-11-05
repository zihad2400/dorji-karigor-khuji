'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBriefcase, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';
import { showToast } from '@/components/ui/CustomToast';

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/company/jobs');
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!confirm('আপনি কি নিশ্চিত এই জব পোস্টটি ডিলিট করতে চান?')) return;
    try {
      const res = await fetch(`/api/company/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('জব পোস্ট ডিলিট হয়েছে', 'success');
        setJobs(jobs.filter(j => j._id !== jobId));
      }
    } catch (error) {
      showToast('ডিলিট ব্যর্থ', 'error');
    }
  };

  return (
    <div>
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">আমার জব পোস্টসমূহ</h1>
        <Link href="/company/jobs/create" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <FiPlus /> নতুন জব
        </Link>
      </div>

      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : jobs.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-gray-800">
          <FiBriefcase className="mx-auto text-4xl text-gray-600 mb-3" />
          <p className="text-text-secondary">আপনি এখনো কোনো জব পোস্ট করেননি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-surface rounded-xl border border-gray-800 p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-text-primary font-bold">{job.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  job.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                  job.status === 'Pending Approval' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{job.status}</span>
              </div>
              <p className="text-sm text-text-secondary mb-3">{job.category} • {job.workersRequired} জন প্রয়োজন</p>
              <div className="flex gap-2">
                <Link href={`/jobs/${job._id}`} className="flex-1 text-center bg-background border border-gray-700 text-text-primary text-xs py-2 rounded-lg hover:border-primary">
                  <FiEye className="inline mr-1" /> দেখুন
                </Link>
                <button onClick={() => handleDelete(job._id)} className="flex-1 bg-red-500/10 text-red-400 text-xs py-2 rounded-lg hover:bg-red-500/20">
                  <FiTrash2 className="inline mr-1" /> ডিলিট
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
