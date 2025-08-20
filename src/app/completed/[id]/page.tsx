
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import * as api from '@/lib/api';
import type { ApplicationDetails } from '@/lib/mock-data';

export default function UserCompletedInternshipDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn, token } = useAuth();
    const { toast } = useToast();
    const appId = parseInt(params.id as string, 10);

    const [details, setDetails] = useState<ApplicationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        if (!isLoggedIn) {
          router.push(`/login?redirect=/completed/${appId}`);
        }
    }, [isLoggedIn, router, appId]);

    const fetchDetails = useCallback(async () => {
        if (!token || isNaN(appId)) return;
        setIsLoading(true);
        try {
            const data = await api.getCompletedInternshipDetails(appId, token);
            setDetails(data);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Completed internship application not found.' });
            router.replace('/my-games');
        } finally {
            setIsLoading(false);
        }
    }, [appId, token, router, toast]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    if (isLoading || !details) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 flex-1">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{details.internship.title}</h1>
                    <p className="text-muted-foreground">Completed Internship Details</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Internship Summary</CardTitle>
                    <CardDescription>All information is read-only.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div><Label>Intern Name</Label><Input value={details.userName} disabled /></div>
                    <div><Label>Internship Role</Label><Input value={details.internship.title} disabled /></div>
                    <div><Label>Start Date</Label><Input value={details.applicationDate ? format(parseISO(details.applicationDate), 'PPP') : 'N/A'} disabled /></div>
                    <div><Label>End Date</Label><Input value={details.endDate ? format(parseISO(details.endDate), 'PPP') : 'N/A'} disabled /></div>
                    <div><Label>Personal Email</Label><Input value={details.userEmail} disabled /></div>
                    <div><Label>Personal Phone</Label><Input value={details.userPhone} disabled /></div>
                    <div><Label>Work Email</Label><Input value={details.workEmail || 'N/A'} disabled /></div>
                    <div><Label>Reporting To</Label><Input value={details.reportingTo || 'N/A'} disabled /></div>
                    
                    {details.driveLink && (
                         <div className="md:col-span-2">
                             <Label>Internship Documents</Label>
                             <div className="border p-4 rounded-md space-y-2">
                                <p className="text-sm text-muted-foreground">Your work and documents from this internship have been archived. You can access them via the Google Drive link below.</p>
                                <div>
                                    <Button asChild variant="secondary">
                                        <a href={details.driveLink} target="_blank" rel="noopener noreferrer">
                                            Open Google Drive <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2">This is only valid till 30 days from end of internship.</p>
                                </div>
                             </div>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
