'use client';
import { useState, useEffect } from 'react';
import { FiUser, FiCheck, FiX, FiEye } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';
import { showToast } from '@/components/ui/CustomToast';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? '/api/company/applications' 
        : `/api/company/applications?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const handleStatusChange = async (appId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/company/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
      });
      if (res.ok) {
        setApplications(applications.map(a => a._id === appId ? { ...a, status: newStatus } : a));
        showToast(`স্ট্যাটাস ${newStatus === 'Shortlisted' ? 'শর্টলিস্ট' : 'রিজেক্ট'} করা হয়েছে`, 'success');
      } else {
        showToast('আপডেট ব্যর্থ', 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Submitted': return 'bg-blue-500/20 text-blue-400';
      case 'Shortlisted': return 'bg-green-500/20 text-green-400';
      case 'Interview Invited': return 'bg-yellow-500/20 text-yellow-400';
      case 'Hired': return 'bg-purple-500/20 text-purple-400';
      case 'Rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      <h1 className="text-2xl font-bold text-text-primary mb-6">আবেদনকারী তালিকা</h1>

      {/* ফিল্টার বার */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'সব' },
          { key: 'Submitted', label: 'Submitted' },
          { key: 'Shortlisted', label: 'Shortlisted' },
          { key: 'Interview Invited', label: 'Interview Invited' },
          { key: 'Hired', label: 'Hired' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === tab.key 
                ? 'bg-primary text-white' 
                : 'bg-surface border border-gray-700 text-text-secondary hover:border-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-gray-800">
          <FiUser className="mx-auto text-4xl text-gray-600 mb-3" />
          <p className="text-text-secondary">কোনো আবেদন নেই।</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-text-secondary">
              <tr>
                <th className="px-6 py-3">কারিগর</th>
                <th className="px-6 py-3">জব</th>
                <th className="px-6 py-3">স্ট্যাটাস</th>
                <th className="px-6 py-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-b border-gray-800 hover:bg-background/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-text-primary font-medium">{app.artisan?.name || 'N/A'}</p>
                      <p className="text-xs text-text-secondary">{app.artisan?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{app.job?.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => handleStatusChange(app._id, 'Shortlisted')} 
                        disabled={actionLoading || app.status === 'Shortlisted'}
                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition disabled:opacity-30"
                        title="শর্টলিস্ট করুন"
                      >
                        <FiCheck size={16} />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app._id, 'Rejected')} 
                        disabled={actionLoading || app.status === 'Rejected'}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition disabled:opacity-30"
                        title="রিজেক্ট করুন"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
