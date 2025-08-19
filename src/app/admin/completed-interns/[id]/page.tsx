
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import type { DetailedApplication } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const formSchema = z.object({
  workEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  driveLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  reportingTo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CompletedInternDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const { toast } = useToast();
    const appId = parseInt(params.id as string, 10);
    
    const [application, setApplication] = useState<DetailedApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const fetchApplicationDetails = useCallback(async () => {
        if (!token || isNaN(appId)) return;
        setIsLoading(true);
        try {
            const data = await api.getApplicationDetails(appId, token);
            setApplication(data);
            form.reset({
                workEmail: data.workEmail || '',
                driveLink: data.driveLink || '',
                reportingTo: data.reportingTo || '',
            });
        } catch (error: any) {
            toast({ title: 'Error', description: 'Failed to fetch application details.', variant: 'destructive' });
            router.push('/admin/completed-interns');
        } finally {
            setIsLoading(false);
        }
    }, [appId, token, toast, router, form]);

    useEffect(() => {
        fetchApplicationDetails();
    }, [fetchApplicationDetails]);


    async function onSubmit(values: FormValues) {
        if (!application || !token) return;
        
        const payload: Partial<FormValues> = {};
        if (values.workEmail !== (application.workEmail || '')) payload.workEmail = values.workEmail;
        if (values.driveLink !== (application.driveLink || '')) payload.driveLink = values.driveLink;
        if (values.reportingTo !== (application.reportingTo || '')) payload.reportingTo = values.reportingTo;
        
        if (Object.keys(payload).length === 0) {
            toast({ title: 'No changes', description: 'No information was modified.' });
            return;
        }

        try {
            await api.updateApplicationDetails(appId, payload, token);
            toast({ title: 'Success', description: 'Intern details have been updated.' });
            fetchApplicationDetails(); // Refresh data
        } catch (error: any) {
            toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
        }
    }

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
                    <h1 className="text-2xl font-bold">Completed Internship</h1>
                    <p className="text-muted-foreground">Viewing details for intern: {application.applicantName}</p>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Intern Details</CardTitle>
                            <CardDescription>View and edit basic information for this completed internship.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><Label>Intern Name</Label><Input value={application.applicantName} disabled /></div>
                            <div><Label>Personal Email</Label><Input value={application.applicantEmail} disabled /></div>
                            <div><Label>Personal Phone</Label><Input value={application.applicantPhone} disabled /></div>

                            <FormField control={form.control} name="workEmail" render={({ field }) => (
                                <FormItem><FormLabel>Work Email</FormLabel><FormControl><Input placeholder="work.email@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div><Label>Intern ID</Label><Input value={application.companyInternId || 'N/A'} disabled /></div>
                             <FormField control={form.control} name="reportingTo" render={({ field }) => (
                                <FormItem><FormLabel>Reporting To</FormLabel><FormControl><Input placeholder="e.g., Mr. Smith" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div><Label>Start Date</Label><Input value={format(parseISO(application.applicationDate), 'PPP')} disabled /></div>
                            <div><Label>End Date</Label><Input value={application.internshipEndDate ? format(parseISO(application.internshipEndDate), 'PPP') : 'N/A'} disabled /></div>
                             <FormField control={form.control} name="driveLink" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Google Drive Link</FormLabel><FormControl><Input placeholder="https://docs.google.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
