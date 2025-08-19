
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import type { DetailedApplication } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function TerminatedInternDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const { toast } = useToast();
    const appId = parseInt(params.id as string, 10);
    
    const [application, setApplication] = useState<DetailedApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApplicationDetails = useCallback(async () => {
        if (!token || isNaN(appId)) return;
        setIsLoading(true);
        try {
            const data = await api.getApplicationDetails(appId, token);
            setApplication(data);
        } catch (error: any) {
            toast({ title: 'Error', description: 'Failed to fetch application details.', variant: 'destructive' });
            router.push('/admin/terminated-interns');
        } finally {
            setIsLoading(false);
        }
    }, [appId, token, toast, router]);

    useEffect(() => {
        fetchApplicationDetails();
    }, [fetchApplicationDetails]);


    if (isLoading || !application) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Terminated Internship</h1>
                    <p className="text-muted-foreground">Viewing details for intern: {application.applicantName}</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Intern Details</CardTitle>
                    <CardDescription>This internship was terminated. All information is read-only.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div><Label>Intern Name</Label><Input value={application.applicantName} disabled /></div>
                    <div><Label>Personal Email</Label><Input value={application.applicantEmail} disabled /></div>
                    <div><Label>Personal Phone</Label><Input value={application.applicantPhone} disabled /></div>
                    <div><Label>Work Email</Label><Input value={application.workEmail || 'N/A'} disabled /></div>
                    <div><Label>Intern ID</Label><Input value={application.companyInternId || 'N/A'} disabled /></div>
                    <div><Label>Reporting To</Label><Input value={application.reportingTo || 'N/A'} disabled /></div>
                    <div><Label>Start Date</Label><Input value={application.applicationDate ? format(parseISO(application.applicationDate), 'PPP') : 'N/A'} disabled /></div>
                    <div><Label>Termination Date</Label><Input value={application.internshipEndDate ? format(parseISO(application.internshipEndDate), 'PPP') : 'N/A'} disabled /></div>
                    {application.adminComments && (
                        <div className="md:col-span-2">
                            <Label>Admin Comments on Termination</Label>
                            <div className="p-3 border rounded-md text-sm text-muted-foreground min-h-[80px]" dangerouslySetInnerHTML={{ __html: application.adminComments }} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
