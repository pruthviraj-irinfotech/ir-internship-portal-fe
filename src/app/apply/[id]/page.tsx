
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { internships } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle, FileText } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
  resume: z
    .any()
    .refine((files) => files?.length === 1, "Resume is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf format is supported."
    ),
  whyApply: z.string().min(50, { message: "Please elaborate more (at least 50 characters)." }),
  altEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  altPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional().or(z.literal('')),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const internshipId = params.id as string;
  const internship = internships.find(i => i.id.toString() === internshipId);

  const [submission, setSubmission] = useState<{ number: string; date: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      altEmail: '',
      altPhone: '',
      whyApply: '',
      terms: false,
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/apply/${internshipId}`);
    }
  }, [isLoggedIn, router, internshipId]);

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="text-center">
          <CardHeader><CardTitle>Internship Not Found</CardTitle></CardHeader>
          <CardContent>
            <p>The internship you are looking for does not exist.</p>
            <Button onClick={() => router.push('/')} className="mt-4">Back to Internships</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submission) {
    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                    <CardTitle className="text-2xl font-headline text-primary">Quest Submitted!</CardTitle>
                    <CardDescription>Your application has been successfully received.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="border-t pt-4 grid grid-cols-2 gap-2 text-left">
                        <p className="text-muted-foreground">Application Number:</p>
                        <p className="font-mono">{submission.number}</p>
                        <p className="text-muted-foreground">Application Date:</p>
                        <p>{submission.date}</p>
                        <p className="text-muted-foreground">Application Status:</p>
                        <p>In Review</p>
                    </div>
                     <p className="text-xs text-muted-foreground pt-4 border-t mt-2">
                       You can check the application status in this portal under the "Applied" menu. If your CV gets shortlisted, our HR team will mail you with the interview link. This will also be updated in the portal. If you have any queries, mail it to <b className="text-primary">hr@irinfotech.com</b>.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/">Return to Mission Board</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const originalFile = values.resume[0];
    const newFileName = `Player_One_resume_${internship.title.replace(/\s+/g, '_')}.pdf`;
    console.log(`Simulating upload: renaming ${originalFile.name} to ${newFileName}`);
    
    // Simulate API call and update mock data
    const appDate = new Date().toLocaleDateString('en-GB');
    const internshipIndex = internships.findIndex(i => i.id === internship.id);
    if (internshipIndex !== -1) {
      internships[internshipIndex].applied = true;
      internships[internshipIndex].status = 'In Review';
      internships[internshipIndex].applicationDate = appDate;
    }

    setSubmission({
        number: `APP-${Date.now()}`,
        date: appDate,
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-headline text-primary">Apply for Internship</h1>
        <p className="text-muted-foreground mt-2">{internship.title} at {internship.company}</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Your Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Player Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>P1</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Player One</p>
                        <p className="text-sm text-muted-foreground">player1@email.com</p>
                        <p className="text-sm text-muted-foreground">123-456-7890</p>
                    </div>
                </div>
                <FormField
                  control={form.control}
                  name="altEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Email</FormLabel>
                      <FormControl><Input placeholder="alt@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="altPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Phone</FormLabel>
                      <FormControl><Input placeholder="987-654-3210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Internship Info</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div><Label>Position</Label><p>{internship.title}</p></div>
                <div><Label>Duration</Label><p>{internship.duration}</p></div>
                <div><Label>Category</Label><p>{internship.category}</p></div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader><CardTitle>Your Application</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Resume (PDF, max 5MB) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                            className="pt-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="whyApply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why are you applying for this internship? <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us why you are a great fit for this role..."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the terms and conditions</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Quest'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
