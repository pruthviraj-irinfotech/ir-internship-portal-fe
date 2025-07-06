
'use client';

import { useState, useEffect } from 'react';
import { InternshipCard } from '@/components/internship-card';
import { Input } from '@/components/ui/input';
import { internships, Internship } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(internships);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = internships.filter(internship =>
      internship.title.toLowerCase().includes(lowercasedTerm) ||
      internship.company.toLowerCase().includes(lowercasedTerm) ||
      (internship.description && internship.description.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredInternships(results);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-4xl md:text-6xl font-headline text-primary animate-pulse">IR Intern Portal</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Your quest for the perfect internship begins here.</p>
      </header>

      <section className="mb-16 text-center">
         <blockquote className="text-lg italic text-muted-foreground max-w-3xl mx-auto">
          "Work life is a game; the sooner you learn the rules, the better you&apos;ll play. Master your skills from level one."
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Start Your Journey</CardTitle>
                    <CardDescription>Your first steps into the professional world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src="https://placehold.co/600x400.png" alt="A robot walking, representing the start of a journey" width={600} height={400} className="rounded-md" data-ai-hint="walking robot" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Level Up Your Skills</CardTitle>
                    <CardDescription>Gain experience and unlock new abilities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src="https://placehold.co/600x400.png" alt="A skill tree, representing gaining skills" width={600} height={400} className="rounded-md" data-ai-hint="skill tree" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Navigate Your Career</CardTitle>
                    <CardDescription>Overcome challenges and seize opportunities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src="https://placehold.co/600x400.png" alt="A snakes and ladders board, representing career navigation" width={600} height={400} className="rounded-md" data-ai-hint="snakes ladders" />
                </CardContent>
            </Card>
        </div>
      </section>

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or skill..."
            className="w-full pl-12 h-14 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-headline mb-6 text-center">Open Internships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} isLoggedIn={isLoggedIn} />
            ))
          ) : (
             <div className="md:col-span-3 text-center py-16 border-2 border-dashed border-border">
              <p className="text-muted-foreground">No internships found matching your search.</p>
              <p className="text-xs mt-2">Try a different keyword!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
