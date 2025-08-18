
'use client';

import { useState, useEffect, useCallback } from 'react';
import { InternshipCard } from '@/components/internship-card';
import { Input } from '@/components/ui/input';
import { Internship } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const { isLoggedIn, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInternships = useCallback(async (query: string) => {
    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        console.error('API base URL is not configured.');
        setIsLoading(false);
        return;
    }
    try {
        const url = new URL(`${baseUrl}/api/internships`);
        if (query) {
            url.searchParams.append('search', query);
        }
        
        const headers: HeadersInit = {};
        if (isLoggedIn && token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url.toString(), { headers });
        if (!response.ok) {
            console.error('Failed to fetch internships:', response.statusText);
            setInternships([]);
        } else {
            const data = await response.json();
            setInternships(data);
        }
    } catch (error) {
        console.error('An error occurred while fetching internships:', error);
        setInternships([]);
    } finally {
        setIsLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    // Initial fetch
    fetchInternships('');
  }, [fetchInternships]);
  
  useEffect(() => {
    // Debounced search
    const handler = setTimeout(() => {
        if (searchTerm.length === 0 || searchTerm.length > 2) {
             fetchInternships(searchTerm);
        }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchInternships]);

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1 relative">

      <header className="my-8 md:my-16">
        <div className="flex items-center justify-center gap-8">
            <svg viewBox="0 0 100 100" className="relative w-24 h-24 hidden md:block" data-ai-hint="brick game castle">
                {/* Falling piece 1: L-Shape */}
                <g className="brick-game-piece-1">
                    <rect y="0" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect y="10" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect y="20" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect x="10" y="20" width="10" height="10" fill="hsl(var(--primary))"/>
                </g>
                {/* Falling piece 2: Square-Shape */}
                <g className="brick-game-piece-2">
                    <rect y="0" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect x="10" y="0" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect y="10" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect x="10" y="10" width="10" height="10" fill="hsl(var(--primary))"/>
                </g>
                {/* Falling piece 3: T-Shape */}
                <g className="brick-game-piece-3">
                    <rect y="0" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect x="10" y="0" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect x="20" y="0" width="10" height="10" fill="hsl(var(--primary))"/>
                    <rect x="10" y="10" width="10" height="10" fill="hsl(var(--primary))"/>
                </g>
            </svg>
            <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-headline text-primary animate-pulse">IR Intern Portal</h1>
                <p className="text-muted-foreground mt-4 text-sm md:text-base">Your quest for the perfect internship begins here.</p>
            </div>
             <div className="relative w-24 h-24 hidden md:block" data-ai-hint="snake ladder">
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
      </header>

      <section className="mb-16">
         <div className="flex items-center justify-center">
            <blockquote className="text-lg italic text-muted-foreground max-w-2xl text-center">
              "Work life is a game; the sooner you learn the rules, the better you'll play. Master your skills from level one."
            </blockquote>
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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
                    <CardContent className="flex-grow space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
                    <CardFooter className="flex justify-between items-center"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-8 w-1/4" /></CardFooter>
                </Card>
            ))
          ) : internships.length > 0 ? (
            internships.map((internship) => (
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
