
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import type { UserApplicationDetails, Document as DocType } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Calendar, Clock, MessageSquare, FileText, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const statusDisplayMap = {
    'In_Review': { text: 'In Review', variant: 'secondary' as const },
    'Shortlisted': { text: 'Shortlisted', variant: 'default' as const },
    'Interview_Scheduled': { text: 'Interview Scheduled', variant: 'default' as const },
    'Ongoing': { text: 'Ongoing', variant: 'default' as const },
    'Completed': { text: 'Completed', variant: 'default' as const },
    'Terminated': { text: 'Terminated', variant: 'destructive' as const },
    'Rejected': { text: 'Rejected', variant: 'destructive' as const },
    'Withdrawn': { text: 'Withdrawn', variant: 'destructive' as const },
};

export default function ApplicationStatusPage() {
    const params = useParams();
    const router = useRouter();
    const { token, isLoggedIn } = useAuth();
    const { toast } = useToast();
    const applicationId = parseInt(params.id as string, 10);
    
    const [details, setDetails] = useState<UserApplicationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push(`/login?redirect=/applied/${applicationId}`);
        }
    }, [isLoggedIn, router, applicationId]);

    const fetchDetails = useCallback(async () => {
        if (!token || isNaN(applicationId)) return;
        setIsLoading(true);
        try {
            const data = await api.getApplicationDetailsForUser(applicationId, token);
            setDetails(data);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load application details.' });
            router.push('/applied');
        } finally {
            setIsLoading(false);
        }
    }, [applicationId, token, router, toast]);

    useEffect(() => {
        if(isLoggedIn) {
            fetchDetails();
        }
    }, [isLoggedIn, fetchDetails]);
    
    const getFullUrl = (relativeUrl?: string) => {
        if (!relativeUrl) return '#';
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        return relativeUrl.startsWith('http') ? relativeUrl : `${baseUrl}${relativeUrl}`;
    };

    if (isLoading) {
        return (
             <div className="container mx-auto p-4 md:p-8 flex-1">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-10 w-10" />
                    <div>
                        <Skeleton className="h-7 w-64 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-32" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-32" /></div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!details) {
        return null;
    }

    const statusInfo = statusDisplayMap[details.status];

    return (
        <div className="container mx-auto p-4 md:p-8 flex-1">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{details.internship.title}</h1>
                    <p className="text-muted-foreground">Status for your application to {details.internship.company}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>Application # {details.applicationNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                        <div>
                            <Label>Status</Label>
                            <p><Badge variant={statusInfo.variant}>{statusInfo.text}</Badge></p>
                        </div>
                         <div>
                            <Label>Applied On</Label>
                            <p>{format(parseISO(details.applicationDate), 'PPP')}</p>
                        </div>
                    </div>
                    
                    {details.status === 'Interview_Scheduled' && details.interviewDate && (
                        <div className="border-t pt-6 space-y-4">
                            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Calendar className="h-5 w-5" /> Interview Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Date & Time</Label>
                                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {format(parseISO(details.interviewDate), 'PPP, p')}</p>
                                </div>
                                {details.interviewInstructions && (
                                <div className="md:col-span-2">
                                    <Label>Instructions</Label>
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: details.interviewInstructions }} />
                                </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {details.adminComments && (
                         <div className="border-t pt-6 space-y-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Admin Comments</h3>
                             <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: details.adminComments }} />
                        </div>
                    )}

                    <div className="border-t pt-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Your Submission</h3>
                        <div>
                            <Label>Why you applied</Label>
                            <p className="text-sm text-muted-foreground line-clamp-3">{details.whyApply}</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {details.resumeUrl && (
                                <Button asChild variant="secondary" size="sm">
                                    <a href={getFullUrl(details.resumeUrl)} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" /> View Resume
                                    </a>
                                </Button>
                            )}
                             {details.documents && details.documents.map((doc: DocType) => (
                                <Button key={doc.id} asChild variant="secondary" size="sm">
                                    <a href={getFullUrl(doc.url)} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" /> {doc.name}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-6 border-t">
                        Note: Applications are reviewed for up to one month. If you have any queries, please email us at <b className="text-primary">hr@irinfotech.com</b>.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
