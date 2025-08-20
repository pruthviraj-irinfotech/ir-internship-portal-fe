
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import RichTextEditor from '@/components/rich-text-editor';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import type { DetailedCertificate, CertificateStatus } from '@/lib/mock-data';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/png"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const formSchema = z.object({
  applicationId: z.string().min(1, "Please select an application."),
  certificateNumber: z.string().min(1, "Certificate ID is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  issueDate: z.date({ required_error: "Certificate date is required." }),
  description: z.string().min(1, "Description cannot be empty."),
  pngFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .png format is supported."),
  pdfFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), "Only .pdf format is supported."),
  status: z.enum(['Active', 'On_Hold', 'Terminated'], { required_error: "Please select a status." }),
});

type FormValues = z.infer<typeof formSchema>;

// Use a simplified type for the initial data to avoid complexity before form reset
type InitialData = {
    applicationId: string;
    certificateNumber: string;
    startDate: Date;
    issueDate: Date;
    description: string;
    status: CertificateStatus;
};

export default function EditCertificatePage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const certificateId = parseInt(params.id as string, 10);
    
    const [initialData, setInitialData] = useState<InitialData | null>(null);
    const [allApps, setAllApps] = useState<{ value: number, label: string }[]>([]);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const fetchPageData = useCallback(async () => {
        if (!token || isNaN(certificateId)) return;
        try {
            const [certData, appsData] = await Promise.all([
                api.getCertificateById(certificateId, token),
                api.getAllApplicationsForDropdown(token)
            ]);
            
            setAllApps(appsData);

            const fetchedData: any = {
                applicationId: String(certData.application_id),
                certificateNumber: certData.certificate_id_text ?? '',
                description: certData.description ?? '',
                status: certData.status ?? 'Active',
            };

            // Only parse dates if they exist
            if (certData.internship_start_date) {
                fetchedData.startDate = parseISO(certData.internship_start_date);
            }
             if (certData.certificate_issue_date) {
                fetchedData.issueDate = parseISO(certData.certificate_issue_date);
            }
            
            setInitialData(fetchedData);
            form.reset(fetchedData);

        } catch (error: any) {
            console.error("Error fetching page data:", error);
            const errorMessage = error.message || "An unexpected error occurred.";
            toast({ variant: 'destructive', title: 'Error', description: `Failed to load data: ${errorMessage}`});
            router.push('/admin/certificates');
        }
    }, [token, certificateId, form, router, toast]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);


    async function onSubmit(values: FormValues) {
        if (!token || !initialData) return;

        const dataToSubmit: any = {};
        
        if (values.applicationId !== initialData.applicationId) dataToSubmit.applicationId = parseInt(values.applicationId, 10);
        if (values.certificateNumber !== initialData.certificateNumber) dataToSubmit.certificateNumber = values.certificateNumber;
        if (values.startDate && format(values.startDate, 'yyyy-MM-dd') !== format(initialData.startDate, 'yyyy-MM-dd')) dataToSubmit.startDate = values.startDate.toISOString();
        if (values.issueDate && format(values.issueDate, 'yyyy-MM-dd') !== format(initialData.issueDate, 'yyyy-MM-dd')) dataToSubmit.issueDate = values.issueDate.toISOString();
        if (values.description !== initialData.description) dataToSubmit.description = values.description;
        if (values.status !== initialData.status) dataToSubmit.status = values.status;
        
        const formData = new FormData();
        
        const hasDataChanges = Object.keys(dataToSubmit).length > 0;
        const hasPngFile = values.pngFile && values.pngFile.length > 0;
        const hasPdfFile = values.pdfFile && values.pdfFile.length > 0;

        if (!hasDataChanges && !hasPngFile && !hasPdfFile) {
            toast({ title: "No Changes", description: "You haven't made any changes to save." });
            return;
        }

        if (hasDataChanges) {
            formData.append('data', JSON.stringify(dataToSubmit));
        }
        if (hasPngFile) {
            formData.append('pngFile', values.pngFile[0]);
        }
        if (hasPdfFile) {
            formData.append('pdfFile', values.pdfFile[0]);
        }

        try {
            await api.updateCertificate(certificateId, formData, token);
             toast({
                title: "Success!",
                description: "The certificate has been updated successfully.",
            });
            router.push('/admin/certificates');
        } catch (error: any) {
            toast({ title: "Error!", description: error.message, variant: 'destructive'});
        }
    }

    if (!initialData) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Internship Certificate</CardTitle>
        <CardDescription>Update the details for certificate ID: {initialData.certificateNumber || 'Not available'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="applicationId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Application</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select an application" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {allApps.map(app => (
                                        <SelectItem key={app.value} value={String(app.value)}>
                                            {app.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="certificateNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Certificate ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Internship Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "dd-MM-yy")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Certificate Issue Date</FormLabel>
                             <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "dd-MM-yy")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Certificate Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="md:w-1/2">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="On_Hold">On Hold</SelectItem>
                                    <SelectItem value="Terminated">Terminated</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Internship Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="pngFile"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Upload New PNG (Optional)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="file" 
                                    accept=".png"
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="pdfFile"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Upload New PDF (Optional)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
