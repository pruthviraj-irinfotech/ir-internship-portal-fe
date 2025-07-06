
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applications, internships, Application, Internship } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function UserCompletedInternshipDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { toast } = useToast();
    const appId = params.id as string;

    const [application, setApplication] = useState<Application | null>(null);
    const [internship, setInternship] = useState<Internship | null>(null);

     useEffect(() => {
        if (!isLoggedIn) {
          router.push(`/login?redirect=/completed/${appId}`);
        }
    }, [isLoggedIn, router, appId]);

    useEffect(() => {
        const app = applications.find(a => a.id === appId);
        if (app && app.status === 'Selected') {
            setApplication(app);
            const intern = internships.find(i => i.id === app.internshipId);
            setInternship(intern || null);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Completed internship application not found.' });
            router.replace('/completed');
        }
    }, [appId, router, toast]);

    if (!isLoggedIn || !application || !internship) {
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
                    <h1 className="text-2xl font-bold">{internship.title}</h1>
                    <p className="text-muted-foreground">Completed Internship Details</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Internship Summary</CardTitle>
                    <CardDescription>All information is read-only.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div><Label>Intern Name</Label><Input value={application.userName} disabled /></div>
                    <div><Label>Internship Role</Label><Input value={internship.title} disabled /></div>
                    <div><Label>Start Date</Label><Input value={application.applicationDate ? format(parseISO(application.applicationDate), 'PPP') : 'N/A'} disabled /></div>
                    <div><Label>End Date</Label><Input value={application.endDate ? format(parseISO(application.endDate), 'PPP') : 'N/A'} disabled /></div>
                    <div><Label>Personal Email</Label><Input value={application.userEmail} disabled /></div>
                    <div><Label>Personal Phone</Label><Input value={application.userPhone} disabled /></div>
                    <div><Label>Work Email</Label><Input value={application.workEmail || 'N/A'} disabled /></div>
                    <div><Label>Reporting To</Label><Input value={application.reportingTo || 'N/A'} disabled /></div>
                    
                    {application.driveLink && (
                         <div className="md:col-span-2">
                             <Label>Internship Documents</Label>
                             <div className="border p-4 rounded-md space-y-2">
                                <p className="text-sm text-muted-foreground">Your work and documents from this internship have been archived. You can access them via the Google Drive link below.</p>
                                <div>
                                    <Button asChild variant="secondary">
                                        <a href={application.driveLink} target="_blank" rel="noopener noreferrer">
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
