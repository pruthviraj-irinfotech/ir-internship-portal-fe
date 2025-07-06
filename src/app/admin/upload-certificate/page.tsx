'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { interns, certificates } from '@/lib/mock-data';
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
    .refine((files) => files?.length === 1, "PNG certificate is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .png format is supported."),
  pdfFile: z.any()
    .refine((files) => files?.length === 1, "PDF certificate is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), "Only .pdf format is supported."),
  uploadedBy: z.string().min(1, "Uploader name is required."),
});

export default function UploadCertificatePage() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            internId: '',
            certificateId: '',
            description: '',
            uploadedBy: 'Admin',
        },
    });

    const selectedInternId = form.watch('internId');
    const currentYear = new Date().getFullYear().toString().slice(-2);

    const generateCertId = (internId: string) => {
        if (!internId) return '';
        const intern = interns.find(i => i.id === internId);
        if (!intern) return '';
        return `INT${currentYear}-${intern.id.split('-')[1]}`;
    }

    form.watch((values, { name }) => {
        if (name === 'internId') {
            form.setValue('certificateId', generateCertId(values.internId || ''));
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        
        // In a real app, you would upload files and save data to a database.
        // Here, we just add it to our mock data array.
        const intern = interns.find(i => i.id === values.internId);
        
        const newCertificate = {
            id: values.certificateId,
            internName: intern?.name || 'Unknown Intern',
            internshipRole: 'Role from Internship Data', // This would come from the intern's data
            company: 'IR INFOTECH',
            duration: 'Calculated Duration', // This would be calculated from dates
            startDate: format(values.startDate, 'yyyy-MM-dd'),
            approvedDate: format(values.certificateDate, 'yyyy-MM-dd'),
            description: values.description,
            imageUrl: URL.createObjectURL(values.pngFile[0]), // Temporary URL for display
            pdfUrl: URL.createObjectURL(values.pdfFile[0]), // Temporary URL
            uploadedBy: values.uploadedBy,
        };
        
        certificates.push(newCertificate);
        
        toast({
            title: "Success!",
            description: "The certificate has been uploaded successfully.",
        });

        router.push('/admin/certificates');
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Internship Certificate</CardTitle>
        <CardDescription>Fill in the details below to generate and upload a new certificate.</CardDescription>
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
