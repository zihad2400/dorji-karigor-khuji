'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBriefcase, FiUsers, FiCheckCircle, FiEye, FiPlus, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function CompanyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/company/dashboard');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-text-secondary">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">কোম্পানি ড্যাশবোর্ড</h1>
        <Link href="/company/jobs/create" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
          <FiPlus /> নতুন জব পোস্ট
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            <FiBriefcase size={24} />
          </div>
          <h3 className="text-text-primary text-2xl font-bold mb-1">{data?.activeJobs || 0}</h3>
          <p className="text-text-secondary text-sm">সক্রিয় জব পোস্ট</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-3">
            <FiUsers size={24} />
          </div>
          <h3 className="text-text-primary text-2xl font-bold mb-1">{data?.totalApplications || 0}</h3>
          <p className="text-text-secondary text-sm">মোট আবেদন</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <FiCheckCircle size={24} />
          </div>
          <h3 className="text-text-primary text-2xl font-bold mb-1">{data?.shortlistedCount || 0}</h3>
          <p className="text-text-secondary text-sm">শর্টলিস্টেড</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-3">
            <FiEye size={24} />
          </div>
          <h3 className="text-text-primary text-2xl font-bold mb-1">{data?.profileViews || 0}</h3>
          <p className="text-text-secondary text-sm">প্রোফাইল ভিউ</p>
        </motion.div>
      </div>

      {/* Recent Applications */}
      <div className="bg-surface rounded-2xl border border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">সাম্প্রতিক আবেদনসমূহ</h2>
          <Link href="/company/applications" className="text-primary-light hover:underline text-sm">সব দেখুন →</Link>
        </div>
        
        {!data?.recentApplications || data.recentApplications.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <FiActivity className="mx-auto text-4xl mb-2 opacity-50" />
            এখনো কোনো আবেদন আসেনি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="text-xs text-gray-400 uppercase bg-background">
                <tr>
                  <th className="px-6 py-3">কারিগরের নাম</th>
                  <th className="px-6 py-3">জব টাইটেল</th>
                  <th className="px-6 py-3">তারিখ</th>
                  <th className="px-6 py-3">স্ট্যাটাস</th>
                  <th className="px-6 py-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {data.recentApplications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-800 hover:bg-surfaceHover">
                    <td className="px-6 py-4 text-text-primary">{app.artisanName}</td>
                    <td className="px-6 py-4">{app.jobTitle}</td>
                    <td className="px-6 py-4">{new Date(app.date).toLocaleDateString('bn-BD')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        app.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400' :
                        app.status === 'Shortlisted' ? 'bg-green-500/20 text-green-400' :
                        app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/company/applications/${app.id}`} className="text-primary-light hover:underline">
                        দেখুন
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
