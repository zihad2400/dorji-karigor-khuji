import { Suspense } from 'react';
import CompanyDetailClient from './CompanyDetailClient';

export default function CompanyDetailPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">
        লোড হচ্ছে...
      </div>
    }>
      <CompanyDetailClientWrapper params={params} />
    </Suspense>
  );
}

// প্যারামস হ্যান্ডেল করার জন্য আলাদা অ্যাসিঙ্ক কম্পোনেন্ট
async function CompanyDetailClientWrapper({ params }) {
  const resolvedParams = await params;
  return <CompanyDetailClient companyId={resolvedParams.id} />;
}
