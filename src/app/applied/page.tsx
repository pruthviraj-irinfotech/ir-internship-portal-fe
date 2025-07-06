
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InternshipCard } from '@/components/internship-card';
import { internships, InternshipStatus } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const applicationStatuses: InternshipStatus[] = [
    'In Review',
    'Shortlisted',
    'Interview Scheduled',
    'Ongoing',
    'Completed',
    'Terminated',
    'Rejected',
    'Withdrawn',
];

export default function AppliedInternshipsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | InternshipStatus>('all');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/applied');
    }
  }, [isLoggedIn, router]);

  const appliedInternships = useMemo(() => {
    return internships.filter(internship => 
        internship.applied &&
        internship.status &&
        applicationStatuses.includes(internship.status) &&
        (statusFilter === 'all' || internship.status === statusFilter)
    );
  }, [statusFilter]);
  
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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | InternshipStatus)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {applicationStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </header>

      <section>
        {appliedInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border">
            <p className="text-muted-foreground">You haven't applied to any internships with this status.</p>
            <p className="text-xs mt-2">Try selecting "All Statuses".</p>
          </div>
        )}
      </section>
    </div>
  );
}
