
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, File, Loader2, Trash2, Upload, CalendarIcon, FileDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Document } from '@/lib/mock-data';

const formSchema = z.object({
  internId: z.string().optional(),
  workEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  reportingTo: z.string().optional(),
  endDate: z.date().optional(),
});

// Mock data as the API for this page is not ready yet
const mockApplication = {
    id: 1,
    userName: 'Pruthviraj B',
    userEmail: 'test@yopmail.com',
    userPhone: '7019985842',
    internshipId: 1,
    applicationDate: '2024-05-20T00:00:00.000Z',
    status: 'Ongoing',
    internId: 101,
    workEmail: 'pruthviraj.b@irinfotech.com',
    reportingTo: 'Mr. John Doe',
    endDate: '2024-08-20T00:00:00.000Z',
    adminDocuments: [
        { id: 1, name: 'Offer_Letter.pdf', url: '#', uploadedAt: '2024-05-20T00:00:00.000Z', size: 123456 },
        { id: 2, name: 'NDA.pdf', url: '#', uploadedAt: '2024-05-21T00:00:00.000Z', size: 789012 },
    ],
    userDocuments: [
        { id: 3, name: 'Intern_ID_Proof.pdf', url: '#', uploadedAt: '2024-05-22T00:00:00.000Z', size: 345678 },
    ],
};

const mockInternship = {
    id: 1,
    title: 'Full Stack Developer',
    duration: '3 Months',
};

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function OngoingInternDetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    // Using mock data directly
    const [application, setApplication] = useState(mockApplication);
    const [internship, setInternship] = useState(mockInternship);
    const [newFile, setNewFile] = useState<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            internId: mockApplication.internId?.toString() || '',
            workEmail: mockApplication.workEmail || '',
            reportingTo: mockApplication.reportingTo || '',
            endDate: mockApplication.endDate ? parseISO(mockApplication.endDate) : undefined,
        }
    });


    const handleDocDelete = (docId: number, type: 'admin' | 'user') => {
        if (!application) return;

        const updatedDocs = (type === 'admin' ? application.adminDocuments : application.userDocuments)?.filter(d => d.id !== docId);

        const updatedApplication = {
            ...application,
            [type === 'admin' ? 'adminDocuments' : 'userDocuments']: updatedDocs,
        };
        
        setApplication(updatedApplication);
        toast({ title: 'Document Deleted', description: 'The document has been removed.' });
    };
    
    const handleFileUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFile || !application) {
            toast({ variant: 'destructive', title: 'No file selected' });
            return;
        }

        const newDoc: Document = {
            id: Date.now(),
            name: newFile.name,
            url: '#', 
            uploadedAt: new Date().toISOString(),
            size: newFile.size,
        };

        const updatedApplication = {
            ...application,
            adminDocuments: [...(application.adminDocuments || []), newDoc],
        };

        setApplication(updatedApplication);
        
        setNewFile(null);
        (e.target as HTMLFormElement).reset();
        toast({ title: 'File Uploaded', description: `${newFile.name} has been added.` });
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!application) return;
        
        const updatedApp = { 
            ...application, 
            ...values,
            internId: values.internId ? parseInt(values.internId, 10) : undefined,
            endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : undefined,
        };

        setApplication(updatedApp);

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
                    <h1 className="text-2xl font-bold">Ongoing Internship: {internship.title}</h1>
                    <p className="text-muted-foreground">Managing intern: {application.userName}</p>
                </div>
            </div>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Intern Management</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <FormField control={form.control} name="internId" render={({ field }) => (
                                <FormItem><FormLabel>Intern ID</FormLabel><FormControl><Input placeholder="e.g., 1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="workEmail" render={({ field }) => (
                                <FormItem><FormLabel>Work Email ID</FormLabel><FormControl><Input placeholder="work.email@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="reportingTo" render={({ field }) => (
                                <FormItem><FormLabel>Reporting To</FormLabel><FormControl><Input placeholder="e.g., Mr. Smith" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="endDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Internship End Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "dd-MM-yy") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Documents for Intern (Admin Uploads)</CardTitle></CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                                {(application.adminDocuments || []).length > 0 ? (
                                    application.adminDocuments!.map(doc => (
                                        <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(doc.uploadedAt), 'dd-MM-yy')} - {formatBytes(doc.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={doc.url} download={doc.name} title="Download Document">
                                                        <FileDown className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDocDelete(doc.id, 'admin')} title="Delete Document">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded by admin.</p>
                                )}
                           </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Documents from Intern</CardTitle></CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                                {(application.userDocuments || []).length > 0 ? (
                                    application.userDocuments!.map(doc => (
                                         <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(doc.uploadedAt), 'dd-MM-yy')} - {formatBytes(doc.size)}
                                                    </p>
                                                </div>
                                            </div>
                                             <div className="flex items-center">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={doc.url} download={doc.name} title="Download Document">
                                                        <FileDown className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDocDelete(doc.id, 'user')} title="Delete Document">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No documents submitted by intern yet.</p>
                                )}
                           </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Intern Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <div><Label>Intern Name</Label><p>{application.userName}</p></div>
                            <div><Label>Email ID</Label><p>{application.userEmail}</p></div>
                            <div><Label>Phone Number</Label><p>{application.userPhone}</p></div>
                            <div><Label>Internship Start Date</Label><p>{format(new Date(application.applicationDate), 'dd-MM-yy')}</p></div>
                            <div><Label>Role</Label><p>{internship.title}</p></div>
                            <div><Label>Duration</Label><p>{internship.duration}</p></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Upload New Document</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleFileUpload} className="space-y-4">
                                <Input type="file" onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)} />
                                <Button className="w-full" type="submit" disabled={!newFile}>
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>
            </form>
            </Form>
        </div>
    );
}
