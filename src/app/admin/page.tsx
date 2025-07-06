'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/internships');
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center">
        <p>Loading Admin Panel...</p>
    </div>
  )
}
