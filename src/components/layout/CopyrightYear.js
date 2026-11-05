'use client';
import { useState, useEffect } from 'react';

export default function CopyrightYear() {
  const [year, setYear] = useState('২০২৬'); // ডিফল্ট ভ্যালু

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return <>{year}</>;
}
