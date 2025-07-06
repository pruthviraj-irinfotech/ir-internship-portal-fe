'use client';

import { useState, useEffect } from 'react';
import { InternshipCard } from '@/components/internship-card';
import { Input } from '@/components/ui/input';
import { internships, Internship } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

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
    <div className="container mx-auto p-4 md:p-8 flex-1 relative">

      <header className="text-center my-8 md:my-16">
        <h1 className="text-4xl md:text-6xl font-headline text-primary animate-pulse">IR Intern Portal</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Your quest for the perfect internship begins here.</p>
      </header>

      <section className="mb-16">
         <div className="flex items-center justify-center gap-8">
             <svg viewBox="0 0 100 100" className="relative w-32 h-32 hidden md:block" data-ai-hint="chess game">
                <defs>
                    <pattern id="chess-pattern" patternUnits="userSpaceOnUse" width="25" height="25" className='text-foreground/50'>
                        <rect width="12.5" height="12.5" fill="currentColor" />
                        <rect x="12.5" y="12.5" width="12.5" height="12.5" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#chess-pattern)" className="opacity-50" />
                
                {/* Static Pieces */}
                {/* White Queen */}
                <path transform="translate(62.5, 87.5) scale(1.5)" d="M4 2v2h16V2l-2 4h-3l-1-4h-2l-1 4h-3l-2-4H4zm2 6v8h12V8H6z" fill="hsl(var(--foreground))" stroke="hsl(var(--background))" strokeWidth="0.5"/>
                {/* White Pawn */}
                <path transform="translate(37.5, 87.5) scale(1.5)" d="M12 2a4 4 0 110 8 4 4 0 010-8zm-6 10h12v2H6v-2zm1 4h10v2H7v-2zm1 4h8v2H8v-2z" fill="hsl(var(--foreground))" stroke="hsl(var(--background))" strokeWidth="0.5"/>
                
                {/* Black Queen */}
                <path transform="translate(37.5, 12.5) scale(1.5)" d="M4 2v2h16V2l-2 4h-3l-1-4h-2l-1 4h-3l-2-4H4zm2 6v8h12V8H6z" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="0.5"/>
                {/* Black Pawn */}
                <path transform="translate(12.5, 12.5) scale(1.5)" d="M12 2a4 4 0 110 8 4 4 0 010-8zm-6 10h12v2H6v-2zm1 4h10v2H7v-2zm1 4h8v2H8v-2z" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="0.5"/>

                <path className="knight-animation" d="M12 2C9.25 2 7.08 4.25 7.08 7c0 1.15.4 2.23 1.07 3.08L5.25 20H3v2h18v-2h-2.25L15.92 10.08A4.9 4.9 0 0016.92 7c0-2.75-2.25-5-5-5h-.01zm-.5 3c.83 0 1.5.67 1.5 1.5S12.33 8 11.5 8 10 7.33 10 6.5 10.67 5 11.5 5z" fill="hsl(var(--primary))"/>
            </svg>
            <blockquote className="text-lg italic text-muted-foreground max-w-2xl">
              "Work life is a game; the sooner you learn the rules, the better you'll play. Master your skills from level one."
            </blockquote>
             <div className="relative w-32 h-32 hidden md:block" data-ai-hint="snake ladder">
                <svg viewBox="0 0 100 100" className="absolute inset-0 text-foreground/50">
                    {/* Ladder */}
                    <line x1="30" y1="5" x2="30" y2="95" stroke="currentColor" strokeWidth="4" />
                    <line x1="70" y1="5" x2="70" y2="95" stroke="currentColor" strokeWidth="4" />
                    <line x1="30" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="3" />
                    <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="3" />
                    <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="3" />
                    <line x1="30" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="3" />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Snake */}
                    <path 
                    d="M50 95 L50 85 L60 85 L60 75 L50 75 L50 65 L40 65 L40 55 L50 55 L50 45 L60 45 L60 35 L50 35 L50 25 L40 25 L40 15 L50 15 L50 5"
                    stroke="hsl(var(--primary))" 
                    strokeWidth="5" 
                    fill="none"
                    className="snake-animation" 
                    />
                </svg>
            </div>
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
