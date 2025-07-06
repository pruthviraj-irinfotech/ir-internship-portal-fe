
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applications, internships, Application, Internship } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function TerminatedInternDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const appId = parseInt(params.id as string, 10);

    const [application, setApplication] = useState<Application | null>(null);
    const [internship, setInternship] = useState<Internship | null>(null);

    useEffect(() => {
        const app = applications.find(a => a.id === appId);
        if (app && app.status === 'Terminated') {
            setApplication(app);
            const intern = internships.find(i => i.id === app.internshipId);
            setInternship(intern || null);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Terminated internship application not found.' });
            router.replace('/admin/terminated-interns');
        }
    }, [appId, router, toast]);

    if (!application || !internship) {
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
                    <h1 className="text-2xl font-bold">Terminated Internship: {internship.title}</h1>
                    <p className="text-muted-foreground">Viewing details for intern: {application.userName}</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Intern Details</CardTitle>
                    <CardDescription>This internship was terminated. All information is read-only.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div><Label>Intern Name</Label><Input value={application.userName} disabled /></div>
                    <div><Label>Personal Email</Label><Input value={application.userEmail} disabled /></div>
                    <div><Label>Personal Phone</Label><Input value={application.userPhone} disabled /></div>
                    <div><Label>Work Email</Label><Input value={application.workEmail || 'N/A'} disabled /></div>
                    <div><Label>Intern ID</Label><Input value={application.internId?.toString() || 'N/A'} disabled /></div>
                    <div><Label>Reporting To</Label><Input value={application.reportingTo || 'N/A'} disabled /></div>
                    <div><Label>Start Date</Label><Input value={application.applicationDate ? format(parseISO(application.applicationDate), 'PPP') : 'N/A'} disabled /></div>
                    <div><Label>Termination Date</Label><Input value={application.endDate ? format(parseISO(application.endDate), 'PPP') : 'N/A'} disabled /></div>
                    {application.comments && (
                        <div className="md:col-span-2">
                            <Label>Admin Comments on Termination</Label>
                            <div className="p-3 border rounded-md text-sm text-muted-foreground min-h-[80px]" dangerouslySetInnerHTML={{ __html: application.comments }} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
