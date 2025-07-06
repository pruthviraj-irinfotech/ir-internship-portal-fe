'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { internships, Internship } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  location: z.string().min(2, "Location is required."),
  duration: z.string().min(3, "Duration is required."),
  category: z.enum(['Stipend', 'Paid', 'Free'], { required_error: "Please select a category."}),
  amount: z.string().optional(),
  description: z.string().min(20, "Short description must be at least 20 characters."),
  detailedDescription: z.string().min(50, "Detailed description must be at least 50 characters."),
  whoCanApply: z.string().min(10, "Please provide details on who can apply."),
  perksAndBenefits: z.string().min(10, "Please list some perks or benefits."),
  selectionProcess: z.string().min(10, "Please describe the selection process."),
  announcements: z.string().optional(),
}).refine((data) => {
    if ((data.category === 'Stipend' || data.category === 'Paid') && (!data.amount || data.amount.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Amount is required for Stipend or Paid internships.",
    path: ["amount"],
});

type FormValues = z.infer<typeof formSchema>;

export default function EditInternshipPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const internshipId = parseInt(params.id as string, 10);
    
    const [internship, setInternship] = useState<Internship | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const internToEdit = internships.find(i => i.id === internshipId);
        if (internToEdit) {
            setInternship(internToEdit);
            form.reset({
                ...internToEdit,
                amount: internToEdit.amount || '',
                announcements: internToEdit.announcements || '',
            });
        } else {
             toast({
                title: "Error!",
                description: "Internship not found.",
                variant: 'destructive',
            });
            router.push('/admin/internships');
        }
    }, [internshipId, form, router, toast]);

    const category = form.watch('category');

    function onSubmit(values: FormValues) {
        const internIndex = internships.findIndex(i => i.id === internshipId);
        if (internIndex === -1) {
             toast({ title: "Error!", description: "Could not find internship to update.", variant: 'destructive'});
             return;
        }

        const updatedInternship = { ...internships[internIndex], ...values };
        
        internships[internIndex] = updatedInternship;
        
        toast({
            title: "Success!",
            description: "The internship has been updated successfully.",
        });

        router.push('/admin/internships');
    }
    
    if (!internship) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Internship</CardTitle>
        <CardDescription>Update the details for "{internship.title}"</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Internship Title</FormLabel>
                                <FormControl><Input placeholder="e.g., React Js Frontend" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl><Input placeholder="e.g., Remote" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl><Input placeholder="e.g., 3 Months" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Stipend">Stipend</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Free">Free</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {(category === 'Stipend' || category === 'Paid') && (
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl><Input placeholder="e.g., 15,000/month or 10,000" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                 </div>

                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                             <FormControl>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                             <FormDesc>This will be visible on the main internship listings page.</FormDesc>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="detailedDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Detailed Role Description</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDesc>This will be visible on the internship details page.</FormDesc>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="whoCanApply"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Who Can Apply</FormLabel>
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
                     <FormField
                        control={form.control}
                        name="perksAndBenefits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Perks and Benefits</FormLabel>
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
                     <FormField
                        control={form.control}
                        name="selectionProcess"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selection Process</FormLabel>
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
                     <FormField
                        control={form.control}
                        name="announcements"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Important Announcements (Optional)</FormLabel>
                                <FormControl>
                                     <RichTextEditor
                                        value={field.value || ''}
                                        onChange={field.onChange}
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
