'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin (in a real app, this would come from auth/session)
    // For now, check localStorage for user mode preference
    const userMode = localStorage.getItem('userMode') || 'user';
    
    if (userMode === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/user');
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
