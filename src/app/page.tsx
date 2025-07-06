'use client';

import { InternshipCard } from '@/components/internship-card';
import { Input } from '@/components/ui/input';
import { internships } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-4xl md:text-6xl font-headline text-primary animate-pulse">IR Intern Portal</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Your quest for the perfect internship begins here.</p>
      </header>

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or skill..."
            className="w-full pl-12 h-14 text-base"
          />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-headline mb-6 text-center">Open Internships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </section>
    </div>
  );
}
