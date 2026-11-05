'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import BackButton from '@/components/ui/BackButton';

export default function SavedPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artisan/favorites')
      .then(res => res.ok ? res.json() : { favorites: [] })
      .then(data => { setFavorites(data.favorites || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface rounded-2xl border border-gray-800 p-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <FiHeart className="text-pink-500" /> পছন্দের তালিকা
      </h1>
      {loading ? <p className="text-text-secondary">লোড হচ্ছে...</p> : favorites.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-text-secondary">আপনি এখনো কাউকে পছন্দ করেননি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((profile) => (
            <Link key={profile._id} href={`/artisans/${profile.biodataId}`} className="bg-background p-4 rounded-xl border border-gray-700 hover:border-primary transition flex items-center gap-4">
              <ProfileAvatar gender={profile.gender} size="medium" />
              <div>
                <h3 className="text-text-primary font-medium">{profile.fullName}</h3>
                <p className="text-xs text-primary-light">{profile.biodataId}</p>
                <p className="text-xs text-text-secondary">{profile.primarySkill}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
