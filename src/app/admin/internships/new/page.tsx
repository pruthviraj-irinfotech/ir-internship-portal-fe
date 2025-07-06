'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { internships } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  location: z.string().min(2, "Location is required."),
  duration: z.string().min(3, "Duration is required."),
  category: z.enum(['Stipend', 'Paid', 'Free'], { required_error: "Please select a category."}),
  amount: z.coerce.number().optional(),
  isMonthly: z.boolean().optional().default(false),
  description: z.string().min(20, "Short description must be at least 20 characters."),
  detailedDescription: z.string().min(50, "Detailed description must be at least 50 characters."),
  whoCanApply: z.string().min(10, "Please provide details on who can apply."),
  perksAndBenefits: z.string().min(10, "Please list some perks or benefits."),
  selectionProcess: z.string().min(10, "Please describe the selection process."),
  announcements: z.string().optional(),
}).refine((data) => {
    if ((data.category === 'Stipend' || data.category === 'Paid') && (!data.amount || data.amount <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A positive amount is required for Stipend or Paid internships.",
    path: ["amount"],
});

type FormValues = z.infer<typeof formSchema>;

export default function PostNewInternshipPage() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            location: 'Remote',
            duration: '',
            category: 'Stipend',
            amount: undefined,
            isMonthly: false,
            description: '',
            detailedDescription: '',
            whoCanApply: '',
            perksAndBenefits: '',
            selectionProcess: '',
            announcements: '',
        },
    });

    const category = form.watch('category');

    function onSubmit(values: FormValues) {
        const newInternship = {
            id: internships.length + 1,
            title: values.title,
            company: 'IR INFOTECH', // Hardcoded as per mock data
            location: values.location,
            duration: values.duration,
            category: values.category,
            amount: values.amount,
            isMonthly: values.isMonthly,
            postedDate: new Date().toISOString().split('T')[0],
            description: values.description,
            detailedDescription: values.detailedDescription,
            whoCanApply: values.whoCanApply,
            perksAndBenefits: values.perksAndBenefits,
            selectionProcess: values.selectionProcess,
            announcements: values.announcements,
            applied: false,
        };

        internships.unshift(newInternship);

        toast({
            title: "Internship Posted!",
            description: `The "${values.title}" internship has been successfully listed.`,
        });

        router.push('/admin/internships');
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post New Internship</CardTitle>
        <CardDescription>Fill in the form below to create a new internship listing.</CardDescription>
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
                        <div className="flex flex-col gap-2">
                             <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 15000" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="isMonthly"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="isMonthly"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel htmlFor="isMonthly" className="font-normal text-sm">
                                                This is a monthly amount
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
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
                        Post Internship
                    </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
