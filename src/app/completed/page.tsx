
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InternshipCard } from '@/components/internship-card';
import { internships } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';

export default function CompletedInternshipsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/completed');
    }
  }, [isLoggedIn, router]);

  const completedInternships = useMemo(() => {
    return internships.filter(internship => internship.applied && internship.status === 'Selected');
  }, []);
  
  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="my-8 md:my-16">
        <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-headline text-primary">Completed Internships</h1>
            <p className="text-muted-foreground mt-4 text-sm md:text-base">Quests you have successfully conquered.</p>
        </div>
      </header>

      <section>
        {completedInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border">
            <p className="text-muted-foreground">You haven't completed any internships yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
