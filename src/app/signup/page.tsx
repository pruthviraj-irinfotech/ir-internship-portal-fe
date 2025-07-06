
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  countryCode: z.string().min(1, { message: "Country code is required." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  qualification: z.string().min(2, { message: "Please enter your qualification." }),
  status: z.enum(['student', 'graduate', 'professional']),
  orgName: z.string().min(2, { message: "Please enter your organization/institute name." }),
  orgCity: z.string().min(2, { message: "Please enter a city." }),
  orgState: z.string().min(2, { message: "Please enter a state." }),
});


export default function SignupPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      countryCode: '+91',
      phone: '',
      qualification: '',
      status: 'student',
      orgName: '',
      orgCity: '',
      orgState: '',
    },
  });

  const handleNextStep = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({ title: "OTP Sent!", description: "A verification code has been sent to your email." });
    setStep(2);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Success!", description: "Your account has been created. Please log in." });
    const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';
    router.push(loginHref);
  }

  const handleResendOtp = () => {
    toast({ title: "OTP Resent", description: "A new verification code has been sent." });
  }

  const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-primary">Create Account</CardTitle>
          <CardDescription>
            {step === 1 ? 'Enter your details to join' : 'Verify your email'}
          </CardDescription>
        </CardHeader>
        {step === 1 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNextStep)}>
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                 />
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4 space-y-4">
                   <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                <FormLabel>Code</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="qualification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Highest Qualification</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="graduate">Graduate</SelectItem>
                                <SelectItem value="professional">Working Professional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Organization / Institute Information</h3>
                  <FormField
                      control={form.control}
                      name="orgName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization/Institute Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="orgCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <FormField
                          control={form.control}
                          name="orgState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                   </div>
                </div>

              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Continue</Button>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                <Input id="otp" type="text" maxLength={6} required />
                <div className="text-center text-xs pt-2">
                  <Button type="button" variant="link" onClick={handleResendOtp} className="p-0 h-auto">Resend OTP</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Create Account</Button>
            </CardFooter>
          </form>
        )}
        <div className="text-center text-xs text-muted-foreground pb-4">
          Already a player?{' '}
          <Link href={loginHref} passHref>
            <Button variant="link" className="p-0 h-auto">Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
