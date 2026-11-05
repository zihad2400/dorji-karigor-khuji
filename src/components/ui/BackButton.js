'use client';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton({ href = '/artisan/dashboard', label = 'ড্যাশবোর্ডে ফিরে যান' }) {
  return (
    <Link 
      href={href} 
      className="inline-flex items-center gap-2 text-primary-light hover:text-primary transition mb-6 text-sm font-medium"
    >
      <FiArrowLeft /> {label}
    </Link>
  );
}
