'use client';
import { useState, useEffect } from 'react';
import { FiInbox } from 'react-icons/fi';
import BackButton from '@/components/ui/BackButton';

export default function ReceivedProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artisan/received-proposals')
      .then(res => res.ok ? res.json() : { proposals: [] })
      .then(data => { setProposals(data.proposals || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface rounded-2xl border border-gray-800 p-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <FiInbox className="text-green-500" /> প্রস্তাব পেয়েছি
      </h1>
      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : proposals.length === 0 ? (
        <div className="text-center py-12">
          <FiInbox size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-text-secondary">এখনো কোনো প্রস্তাব পাননি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <div key={p._id} className="bg-background p-4 rounded-xl border border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-text-primary font-medium">{p.sender?.name}</h3>
                <p className="text-xs text-text-secondary">{new Date(p.createdAt).toLocaleDateString('bn-BD')}</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
