import { Suspense } from 'react';
import ArtisanProfileClient from './ArtisanProfileClient';

export default function ArtisanProfileDetailPage({ params }) {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">
          লোড হচ্ছে...
        </div>
      }
    >
      {/* params প্রপটি সরাসরি ক্লায়েন্ট কম্পোনেন্টে পাস করা হলো */}
      <ArtisanProfileClient params={params} />
    </Suspense>
  );
}
