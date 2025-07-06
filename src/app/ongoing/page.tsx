
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OngoingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/applied');
  }, [router]);

  return null;
}
