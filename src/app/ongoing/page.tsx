'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InternshipCard } from '@/components/internship-card';
import { internships } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';

export default function OngoingInternshipsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const ongoingInternships = internships.filter(internship => internship.status === 'Ongoing');
  
  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-3xl md:text-5xl font-headline text-primary">Ongoing Internships</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Your current active quests.</p>
      </header>

      <section>
        {ongoingInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border">
            <p className="text-muted-foreground">You don't have any ongoing internships.</p>
            <p className="text-xs mt-2">Complete your applications to start a new quest!</p>
          </div>
        )}
      </section>
    </div>
  );
}
