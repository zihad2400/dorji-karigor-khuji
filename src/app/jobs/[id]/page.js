import { Suspense } from 'react';
import JobDetailClient from './JobDetailClient';

export default function JobDetailPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">
        লোড হচ্ছে...
      </div>
    }>
      <JobDetailClientWrapper params={params} />
    </Suspense>
  );
}

async function JobDetailClientWrapper({ params }) {
  const resolvedParams = await params;
  return <JobDetailClient jobId={resolvedParams.id} />;
}
