'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/history/list');
  }, [router]);

  return null;
} 
