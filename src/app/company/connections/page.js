'use client';
import { useState, useEffect } from 'react';
import { FiUsers, FiMail, FiPhone } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';

export default function CompanyConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/company/connections')
      .then(res => res.ok ? res.json() : { connections: [] })
      .then(data => { setConnections(data.connections || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      <h1 className="text-2xl font-bold text-text-primary mb-6">কানেকশন ক্রয়কারী</h1>

      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : connections.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-gray-800">
          <FiUsers className="mx-auto text-4xl text-gray-600 mb-3" />
          <p className="text-text-secondary">এখনো কেউ আপনার কানেকশন কেনেনি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((conn) => (
            <div key={conn._id} className="bg-surface rounded-xl border border-gray-800 p-5">
              <h3 className="text-text-primary font-bold mb-2">{conn.sender?.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <FiMail size={14} /> {conn.sender?.email}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <FiPhone size={14} /> {conn.sender?.phone || 'N/A'}
                </div>
              </div>
              <p className="text-xs text-primary-light mt-3">
                {new Date(conn.createdAt).toLocaleDateString('bn-BD')} তারিখে কিনেছেন
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
