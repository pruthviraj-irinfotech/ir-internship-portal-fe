'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { interns, certificates, Certificate } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/png"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const formSchema = z.object({
  internId: z.string().min(1, "Please select an intern."),
  certificateId: z.string().min(1, "Certificate ID is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  certificateDate: z.date({ required_error: "Certificate date is required." }),
  description: z.string().min(50, "Description must be at least 50 characters."),
  pngFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .png format is supported."),
  pdfFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), "Only .pdf format is supported."),
  uploadedBy: z.string().min(1, "Uploader name is required."),
});

export default function EditCertificatePage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const certificateId = params.id as string;
    
    const [certificate, setCertificate] = useState<Certificate | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const certToEdit = certificates.find(c => c.id === certificateId);
        if (certToEdit) {
            setCertificate(certToEdit);
            const intern = interns.find(i => i.name === certToEdit.internName);
            form.reset({
                internId: intern?.id || '',
                certificateId: certToEdit.id,
                startDate: certToEdit.startDate ? parseISO(certToEdit.startDate) : new Date(),
                certificateDate: parseISO(certToEdit.approvedDate),
                description: certToEdit.description,
                uploadedBy: certToEdit.uploadedBy || 'Admin',
            });
        } else {
             toast({
                title: "Error!",
                description: "Certificate not found.",
                variant: 'destructive',
            });
            router.push('/admin/certificates');
        }
    }, [certificateId, form, router, toast]);

    if (!certificate) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Updating certificate:", values);
        
        const certIndex = certificates.findIndex(c => c.id === certificateId);
        if (certIndex === -1) {
             toast({ title: "Error!", description: "Could not find certificate to update.", variant: 'destructive'});
             return;
        }

        const intern = interns.find(i => i.id === values.internId);

        const updatedCertificate: Partial<Certificate> = {
            id: values.certificateId,
            internName: intern?.name || 'Unknown Intern',
            startDate: format(values.startDate, 'yyyy-MM-dd'),
            approvedDate: format(values.certificateDate, 'yyyy-MM-dd'),
            description: values.description,
            uploadedBy: values.uploadedBy,
        };

        if (values.pngFile && values.pngFile.length > 0) {
            updatedCertificate.imageUrl = URL.createObjectURL(values.pngFile[0]);
        }
        if (values.pdfFile && values.pdfFile.length > 0) {
            updatedCertificate.pdfUrl = URL.createObjectURL(values.pdfFile[0]);
        }
        
        certificates[certIndex] = { ...certificates[certIndex], ...updatedCertificate };
        
        toast({
            title: "Success!",
            description: "The certificate has been updated successfully.",
        });

        router.push('/admin/certificates');
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Internship Certificate</CardTitle>
        <CardDescription>Update the details for certificate ID: {certificate.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="internId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intern Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select an intern" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {interns.map(intern => (
                                        <SelectItem key={intern.id} value={intern.id}>
                                            {intern.name} ({intern.id})
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
                      name="certificateId"
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
                                        format(field.value, "PPP")
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
                        name="certificateDate"
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
                                        format(field.value, "PPP")
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
                        <Textarea
                            placeholder="Provide a brief description of the intern's role and accomplishments..."
                            className="resize-y min-h-[100px]"
                            {...field}
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

                <FormField
                    control={form.control}
                    name="uploadedBy"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Uploaded By</FormLabel>
                        <FormControl>
                        <Input placeholder="Admin Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

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
