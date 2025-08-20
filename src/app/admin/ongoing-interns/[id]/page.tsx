
'use client';

import { useState, useEffect, useCallback } from 'react';
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
import type { DetailedApplication, Document as DocType } from '@/lib/mock-data';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';


const formSchema = z.object({
  companyInternId: z.string().optional(),
  workEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  reportingTo: z.string().optional(),
  internshipEndDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;


function formatBytes(bytes: number, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function OngoingInternDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const { toast } = useToast();
    const appId = parseInt(params.id as string, 10);
    
    const [application, setApplication] = useState<DetailedApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
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
                companyInternId: data.internId || '',
                workEmail: data.workEmail || '',
                reportingTo: data.reportingTo || '',
                internshipEndDate: data.internshipEndDate ? parseISO(data.internshipEndDate) : undefined,
            });
        } catch (error: any) {
            toast({ title: 'Error', description: 'Failed to fetch application details.', variant: 'destructive' });
            router.push('/admin/ongoing-interns');
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
        if (values.companyInternId !== (application.internId || '')) payload.companyInternId = values.companyInternId;
        if (values.workEmail !== (application.workEmail || '')) payload.workEmail = values.workEmail;
        if (values.reportingTo !== (application.reportingTo || '')) payload.reportingTo = values.reportingTo;
        if (values.internshipEndDate && (!application.internshipEndDate || format(values.internshipEndDate, 'yyyy-MM-dd') !== format(parseISO(application.internshipEndDate), 'yyyy-MM-dd'))) {
            payload.internshipEndDate = values.internshipEndDate;
        }

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
    
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFile || !application || !token) {
            toast({ variant: 'destructive', title: 'No file selected or invalid state' });
            return;
        }
        setIsUploading(true);
        try {
            const uploadedDoc = await api.uploadDocument(application.id, newFile, token);
            setApplication(prev => prev ? ({
                ...prev,
                documentsForIntern: [...(prev.documentsForIntern || []), uploadedDoc]
            }) : null);
            
            setNewFile(null);
            (e.target as HTMLFormElement).reset();
            toast({ title: 'File Uploaded', description: `${newFile.name} has been added.` });
        } catch (error: any) {
            toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDocDelete = async (docId: number) => {
        if (!application || !token) return;

        try {
            await api.deleteDocument(docId, token);
            setApplication(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    documentsForIntern: prev.documentsForIntern?.filter(d => d.id !== docId),
                    documentsFromIntern: prev.documentsFromIntern?.filter(d => d.id !== docId),
                };
            });
            toast({ title: 'Document Deleted', description: 'The document has been removed.' });
        } catch (error: any) {
            toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
        }
    };
    
    const getFullUrl = (relativeUrl: string | null | undefined) => {
        if (!relativeUrl) return '#';
        if (relativeUrl.startsWith('http')) return relativeUrl;
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}${relativeUrl}`;
    };

    if (isLoading || !application) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const { internInfo } = application;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{application.pageTitle || 'Ongoing Internship'}</h1>
                    <p className="text-muted-foreground">Managing intern: {application.managingInternName || 'N/A'}</p>
                </div>
            </div>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Intern Management</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <FormField control={form.control} name="companyInternId" render={({ field }) => (
                                <FormItem><FormLabel>Intern ID</FormLabel><FormControl><Input placeholder="e.g., 101" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="workEmail" render={({ field }) => (
                                <FormItem><FormLabel>Work Email ID</FormLabel><FormControl><Input placeholder="work.email@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="reportingTo" render={({ field }) => (
                                <FormItem><FormLabel>Reporting To</FormLabel><FormControl><Input placeholder="e.g., Mr. Smith" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="internshipEndDate" render={({ field }) => (
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
                                {(application.documentsForIntern || []).length > 0 ? (
                                    application.documentsForIntern!.map(doc => (
                                        <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(parseISO(doc.uploadedAt), 'dd-MM-yy')} - {formatBytes(doc.sizeBytes)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={getFullUrl(doc.url)} download={doc.name} title="Download Document" target="_blank" rel="noopener noreferrer">
                                                        <FileDown className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDocDelete(doc.id)} title="Delete Document">
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
                                {(application.documentsFromIntern || []).length > 0 ? (
                                    application.documentsFromIntern!.map(doc => (
                                         <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(parseISO(doc.uploadedAt), 'dd-MM-yy')} - {formatBytes(doc.sizeBytes)}
                                                    </p>
                                                </div>
                                            </div>
                                             <div className="flex items-center">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={getFullUrl(doc.url)} download={doc.name} title="Download Document" target="_blank" rel="noopener noreferrer">
                                                        <FileDown className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDocDelete(doc.id)} title="Delete Document">
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
                            <div><Label>Intern Name</Label><p>{internInfo?.internName || 'N/A'}</p></div>
                            <div><Label>Email ID</Label><p>{internInfo?.emailId || 'N/A'}</p></div>
                            <div><Label>Phone Number</Label><p>{internInfo?.phoneNumber || 'N/A'}</p></div>
                            <div><Label>Internship Start Date</Label><p>{internInfo?.internshipStartDate ? format(parseISO(internInfo.internshipStartDate), 'dd-MM-yy') : 'N/A'}</p></div>
                            <div><Label>Role</Label><p>{internInfo?.role || 'N/A'}</p></div>
                            <div><Label>Duration</Label><p>{internInfo?.duration || 'N/A'}</p></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Upload New Document</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleFileUpload} className="space-y-4">
                                <Input type="file" onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading}/>
                                <Button className="w-full" type="submit" disabled={!newFile || isUploading}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {isUploading ? 'Uploading...' : 'Upload'}
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

    