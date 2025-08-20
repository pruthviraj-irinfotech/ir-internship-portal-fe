

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { InternshipCard } from '@/components/internship-card';
import { ApiInternshipStatus, MyApplication } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const applicationApiStatuses: ApiInternshipStatus[] = [
    'In_Review',
    'Shortlisted',
    'Interview_Scheduled',
    'Terminated',
    'Rejected',
    'Withdrawn',
];

const statusApiToDisplayMap: Record<ApiInternshipStatus, string> = {
    'In_Review': 'In Review',
    'Shortlisted': 'Shortlisted',
    'Interview_Scheduled': 'Interview Scheduled',
    'Ongoing': 'Ongoing',
    'Completed': 'Completed',
    'Rejected': 'Rejected',
    'Withdrawn': 'Withdrawn',
    'Terminated': 'Terminated',
};

export default function AppliedInternshipsPage() {
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | ApiInternshipStatus>('all');
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/applied');
    }
  }, [isLoggedIn, router]);

  const fetchApplications = useCallback(async () => {
      if (!isLoggedIn || !token) return;
      setIsLoading(true);
      try {
          const data = await api.getMyApplications(token, statusFilter);
          setApplications(data);
      } catch (error: any) {
          toast({
              title: 'Error Fetching Applications',
              description: error.message,
              variant: 'destructive',
          });
      } finally {
          setIsLoading(false);
      }
  }, [isLoggedIn, token, statusFilter, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
  
  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="my-8 md:my-16">
        <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-headline text-primary">My Applications</h1>
            <p className="text-muted-foreground mt-4 text-sm md:text-base">Track the status of all your applications.</p>
        </div>
        <div className="mt-8 max-w-xs mx-auto">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | ApiInternshipStatus)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {applicationApiStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {statusApiToDisplayMap[status]}
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
            <p className="text-muted-foreground">You haven't applied to any internships with this status.</p>
            <p className="text-xs mt-2">Apply for an internship to see it here!</p>
          </div>
        )}
      </section>
    </div>
  );
}
