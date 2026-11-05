'use client';
import { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';

export default function ShortlistedPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/company/applications');
        if (res.ok) {
          const data = await res.json();
          setApplications((data.applications || []).filter(a => a.status === 'Shortlisted'));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      <h1 className="text-2xl font-bold text-text-primary mb-6">শর্টলিস্টেড প্রার্থী</h1>

      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : applications.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-gray-800">
          <FiUser className="mx-auto text-4xl text-gray-600 mb-3" />
          <p className="text-text-secondary">কোনো শর্টলিস্টেড প্রার্থী নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map(app => (
            <div key={app._id} className="bg-surface rounded-xl border border-gray-800 p-5">
              <h3 className="text-text-primary font-bold">{app.artisan?.name}</h3>
              <p className="text-sm text-text-secondary mb-2">{app.job?.title}</p>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Shortlisted</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
