
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
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/rich-text-editor';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import * as api from '@/lib/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/png"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const formSchema = z.object({
  applicationId: z.string().min(1, "Please select an application."),
  certificateNumber: z.string().min(1, "Certificate ID is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  issueDate: z.date({ required_error: "Certificate date is required." }),
  description: z.string().min(50, "Description must be at least 50 characters."),
  pngFile: z.any()
    .refine((files) => files?.length === 1, "PNG certificate is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .png format is supported."),
  pdfFile: z.any()
    .refine((files) => files?.length === 1, "PDF certificate is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), "Only .pdf format is supported."),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadCertificatePage() {
    const { toast } = useToast();
    const router = useRouter();
    const { token, userId } = useAuth();
    const [eligibleApps, setEligibleApps] = useState<{ value: number; label: string }[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            applicationId: '',
            certificateNumber: '',
            description: '',
        },
    });

    const fetchEligibleApps = useCallback(async () => {
        if (!token) return;
        try {
            const data = await api.getEligibleApplications(token);
            setEligibleApps(data);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to load applications: ${error.message}`});
        }
    }, [token, toast]);

    useEffect(() => {
        fetchEligibleApps();
    }, [fetchEligibleApps]);

    const currentYear = new Date().getFullYear().toString().slice(-2);

    const generateCertId = (appId: number) => {
        if (!appId || !userId) return '';
        return `INT${currentYear}-${String(userId).padStart(3, '0')}-${String(appId).padStart(4, '0')}`;
    }

    form.watch((values, { name }) => {
        if (name === 'applicationId') {
            const appIdNum = parseInt(values.applicationId || '0', 10);
            form.setValue('certificateNumber', generateCertId(appIdNum));
        }
    });

    async function onSubmit(values: FormValues) {
        if (!token) return;

        const dataToSubmit = {
            applicationId: parseInt(values.applicationId, 10),
            certificateNumber: values.certificateNumber,
            startDate: format(values.startDate, 'yyyy-MM-dd'),
            issueDate: format(values.issueDate, 'yyyy-MM-dd'),
            description: values.description,
            // Status is defaulted to Active by backend
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(dataToSubmit));
        formData.append('pngFile', values.pngFile[0]);
        formData.append('pdfFile', values.pdfFile[0]);

        try {
            await api.createCertificate(formData, token);
            toast({
                title: "Success!",
                description: "The certificate has been uploaded successfully.",
            });
            router.push('/admin/certificates');
        } catch (error: any) {
             toast({ title: "Error!", description: error.message, variant: 'destructive'});
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Internship Certificate</CardTitle>
        <CardDescription>Fill in the details below to generate and upload a new certificate for a completed internship.</CardDescription>
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
                            <FormLabel>Completed Application</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select an application" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {eligibleApps.length > 0 ? (
                                        eligibleApps.map(app => (
                                            <SelectItem key={app.value} value={app.value.toString()}>
                                                {app.label}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>No eligible applications</SelectItem>
                                    )}
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
                            <Input placeholder="Generated automatically..." {...field} disabled />
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
                            <FormLabel>Upload PNG Certificate</FormLabel>
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
                            <FormLabel>Upload PDF Certificate</FormLabel>
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
                
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload Certificate
                    </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
