
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  driveLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

// Mock data as the API for this page is not ready yet
const mockApplication = {
    id: 1,
    userName: 'Pruthviraj B',
    userEmail: 'test@yopmail.com',
    userPhone: '7019985842',
    internshipId: 1,
    applicationDate: '2024-01-15T00:00:00.000Z',
    status: 'Completed',
    internId: 101,
    workEmail: 'pruthviraj.b@irinfotech.com',
    reportingTo: 'Mr. John Doe',
    endDate: '2024-04-15T00:00:00.000Z',
    driveLink: 'https://docs.google.com/folder/123'
};

const mockInternship = {
    id: 1,
    title: 'Full Stack Developer',
};


export default function CompletedInternDetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    // Using mock data directly
    const [application, setApplication] = useState(mockApplication);
    const [internship, setInternship] = useState(mockInternship);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userEmail: mockApplication.userEmail,
            userPhone: mockApplication.userPhone,
            workEmail: mockApplication.workEmail || '',
            driveLink: mockApplication.driveLink || '',
        }
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!application) return;
        
        const updatedApp = { 
            ...application, 
            userEmail: values.userEmail,
            userPhone: values.userPhone,
            workEmail: values.workEmail,
            driveLink: values.driveLink,
        };

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

                            <div><Label>Intern ID</Label><Input value={application.internId?.toString() || 'N/A'} disabled /></div>
                            <div><Label>Reporting To</Label><Input value={application.reportingTo || 'N/A'} disabled /></div>
                            <div><Label>Start Date</Label><Input value={format(parseISO(application.applicationDate), 'PPP')} disabled /></div>
                            <div><Label>End Date</Label><Input value={application.endDate ? format(parseISO(application.endDate), 'PPP') : 'N/A'} disabled /></div>
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
