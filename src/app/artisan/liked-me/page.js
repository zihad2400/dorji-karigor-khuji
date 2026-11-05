'use client';
import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import BackButton from '@/components/ui/BackButton';

export default function LikedMePage() {
  const [likedBy, setLikedBy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artisan/liked-me')
      .then(res => res.ok ? res.json() : { likedBy: [] })
      .then(data => { setLikedBy(data.likedBy || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface rounded-2xl border border-gray-800 p-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <FiStar className="text-yellow-500" /> আমাকে যারা পছন্দ করেছেন
      </h1>
      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : likedBy.length === 0 ? (
        <div className="text-center py-12">
          <FiStar size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-text-secondary">এখনো কেউ আপনাকে পছন্দ করেনি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {likedBy.map((profile) => (
            <div key={profile._id} className="bg-background p-4 rounded-xl border border-gray-700 flex items-center gap-4">
              <ProfileAvatar gender={profile.gender} size="medium" />
              <div>
                <h3 className="text-text-primary font-medium">{profile.fullName}</h3>
                <p className="text-xs text-primary-light">{profile.biodataId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
