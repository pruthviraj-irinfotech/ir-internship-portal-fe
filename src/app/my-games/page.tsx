
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { InternshipCard } from '@/components/internship-card';
import { MyGameApplication, InternshipStatus } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import * as api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const gameStatuses: ('Ongoing' | 'Completed')[] = [
    'Ongoing',
    'Completed',
];

export default function MyGamesPage() {
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ongoing' | 'Completed'>('all');
  const [applications, setApplications] = useState<MyGameApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyGames = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setIsLoading(true);
    try {
        const data = await api.getMyGames(token, statusFilter);
        setApplications(data);
    } catch (error: any) {
        toast({
            title: 'Error Fetching Games',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }, [isLoggedIn, token, statusFilter, toast]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/my-games');
    } else {
        fetchMyGames();
    }
  }, [isLoggedIn, router, fetchMyGames]);
  
  if (!isLoggedIn) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <Skeleton className="h-8 w-8" />
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="my-8 md:my-16">
        <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-headline text-primary">My Games</h1>
            <p className="text-muted-foreground mt-4 text-sm md:text-base">Track your ongoing and completed internships.</p>
        </div>
        <div className="mt-8 max-w-xs mx-auto">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'Ongoing' | 'Completed')}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    {gameStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </header>

      <section>
        {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
                        <CardContent className="flex-grow space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
                        <CardFooter className="flex justify-between items-center"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-1/3" /></CardFooter>
                    </Card>
                ))}
            </div>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <InternshipCard key={app.id} application={app} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border">
            <p className="text-muted-foreground">You don't have any games with this status.</p>
            <p className="text-xs mt-2">Finish an application to start a new game!</p>
          </div>
        )}
      </section>
    </div>
  );
}
