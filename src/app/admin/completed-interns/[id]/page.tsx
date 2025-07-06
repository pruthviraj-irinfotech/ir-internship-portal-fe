'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applications, internships, Application, Internship } from '@/lib/mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const formSchema = z.object({
  userEmail: z.string().email({ message: "Invalid email address." }),
  userPhone: z.string().min(1, "Phone number is required."),
  workEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
});

export default function CompletedInternDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const appId = params.id as string;

    const [application, setApplication] = useState<Application | null>(null);
    const [internship, setInternship] = useState<Internship | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const app = applications.find(a => a.id === appId);
        if (app && app.status === 'Selected') {
            setApplication(app);
            const intern = internships.find(i => i.id === app.internshipId);
            setInternship(intern || null);
            
            form.reset({
                userEmail: app.userEmail,
                userPhone: app.userPhone,
                workEmail: app.workEmail || '',
            });

        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Completed internship application not found.' });
            router.replace('/admin/completed-interns');
        }
    }, [appId, router, toast, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!application) return;
        
        const appIndex = applications.findIndex(a => a.id === application.id);
        if (appIndex === -1) return;

        // We only update the editable fields
        const updatedApp = { 
            ...applications[appIndex], 
            userEmail: values.userEmail,
            userPhone: values.userPhone,
            workEmail: values.workEmail,
        };

        applications[appIndex] = updatedApp;
        setApplication(updatedApp); // Update local state to reflect changes immediately

        toast({ title: 'Success', description: 'Intern details have been updated.' });
    }

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
                    <h1 className="text-2xl font-bold">Completed Internship: {internship.title}</h1>
                    <p className="text-muted-foreground">Viewing details for intern: {application.userName}</p>
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
                            <div><Label>Intern Name</Label><Input value={application.userName} disabled /></div>
                            
                            <FormField control={form.control} name="userEmail" render={({ field }) => (
                                <FormItem><FormLabel>Personal Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            
                             <FormField control={form.control} name="userPhone" render={({ field }) => (
                                <FormItem><FormLabel>Personal Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <FormField control={form.control} name="workEmail" render={({ field }) => (
                                <FormItem><FormLabel>Work Email</FormLabel><FormControl><Input placeholder="work.email@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />

                            <div><Label>Intern ID</Label><Input value={application.internId || 'N/A'} disabled /></div>
                            <div><Label>Reporting To</Label><Input value={application.reportingTo || 'N/A'} disabled /></div>
                            <div><Label>Start Date</Label><Input value={format(parseISO(application.applicationDate), 'PPP')} disabled /></div>
                            <div><Label>End Date</Label><Input value={application.endDate ? format(parseISO(application.endDate), 'PPP') : 'N/A'} disabled /></div>
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
