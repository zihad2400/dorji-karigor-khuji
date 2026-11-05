'use client';
import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artisan/connections')
      .then(res => res.ok ? res.json() : { connections: [] })
      .then(data => { setConnections(data.connections || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface rounded-2xl border border-gray-800 p-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <FiShoppingCart className="text-purple-500" /> কানেকশন ক্রয়সমূহ
      </h1>
      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : connections.length === 0 ? (
        <div className="text-center py-12">
          <FiShoppingCart size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-text-secondary">আপনি এখনো কোনো কানেকশন কেনেননি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => (
            <div key={conn._id} className="bg-background p-4 rounded-xl border border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-text-primary font-medium">{conn.receiver?.name}</h3>
                <p className="text-xs text-text-secondary">{new Date(conn.createdAt).toLocaleDateString('bn-BD')}</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{conn.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
