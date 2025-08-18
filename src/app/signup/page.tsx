
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MAX_AVATAR_SIZE = 100 * 1024; // 100KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const formSchema = z.object({
  avatar: z
    .any()
    .optional()
    .refine(
        (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_AVATAR_SIZE,
        `Max image size is 100KB.`
    )
    .refine(
        (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .png, .gif and .webp formats are supported."
    ),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  countryCode: z.string().min(1, { message: "Country code is required." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  qualification: z.string().min(2, { message: "Please enter your qualification." }),
  currentStatus: z.enum(['student', 'graduate', 'professional']),
  orgName: z.string().min(2, { message: "Please enter your organization/institute name." }),
  orgCity: z.string().min(2, { message: "Please enter a city." }),
  orgState: z.string().min(2, { message: "Please enter a state." }),
  orgCountry: z.string().min(2, { message: "Please enter a country." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export default function SignupPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("https://placehold.co/100x100.png");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      countryCode: '+91',
      phone: '',
      qualification: '',
      currentStatus: 'student',
      orgName: '',
      orgCity: '',
      orgState: '',
      orgCountry: '',
      avatar: undefined,
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && isResendDisabled) {
        timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, isResendDisabled]);

  const handleRequestOtp = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
        const { confirmPassword, avatar, ...apiData } = values;

        const formData = new FormData();
        formData.append('data', JSON.stringify(apiData));
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register/request-otp`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to request OTP.');
        }

        toast({ title: "OTP Sent!", description: result.message });
        setStep(2);
        setCountdown(120);
        setIsResendDisabled(true);

    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleVerifyOtpAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpError('');
    setIsLoading(true);

    try {
        const { confirmPassword, avatar, ...originalData } = form.getValues();
        const requestBody = {
            otp,
            data: originalData,
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(requestBody));
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register/verify`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'OTP verification failed.');
        }

        toast({ title: "Success!", description: "Your account has been created. Please log in." });
        const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';
        router.push(loginHref);

    } catch (error: any) {
        toast({ title: "Registration Failed", description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }

  const handleResendOtp = async () => {
    await handleRequestOtp(form.getValues());
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (files: FileList | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      fieldOnChange(null);
      return;
    }

    form.clearErrors("avatar");

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("avatar", { type: 'manual', message: 'Please select a PNG, JPG, GIF, or WEBP file.' });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      form.setError("avatar", { type: 'manual', message: 'Please upload an image smaller than 100KB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
    fieldOnChange(e.target.files);
  };

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
            <form onSubmit={form.handleSubmit(handleRequestOtp)}>
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-6 pt-0">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="border-b pb-4 pt-2">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={avatarPreview} alt="Player Avatar" data-ai-hint="user avatar" />
                          <AvatarFallback>P1</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <FormControl>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                              Upload Avatar
                            </Button>
                          </FormControl>
                          <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={(e) => handleAvatarChange(e, field.onChange)}
                          />
                          <p className="text-xs text-muted-foreground">Max 100KB. JPG, PNG, GIF, WEBP.</p>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
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
                        <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
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
                      <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                       <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} {...field} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                           <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                             <span className="sr-only">Toggle confirm password visibility</span>
                          </Button>
                        </div>
                      </FormControl>
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
                                <FormLabel>Code <span className="text-destructive">*</span></FormLabel>
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
                                <FormLabel>Phone <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                   </div>
                   <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Qualification <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Organization / Institute Information</h3>
                   <FormField
                      control={form.control}
                      name="orgName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization/Institute Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                          control={form.control}
                          name="orgCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City <span className="text-destructive">*</span></FormLabel>
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
                              <FormLabel>State <span className="text-destructive">*</span></FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="orgCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                   </div>
                    <FormField
                    control={form.control}
                    name="currentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
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

              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <form onSubmit={handleVerifyOtpAndSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                 <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => {
                        setOtp(e.target.value);
                        if (otpError) setOtpError('');
                    }}
                    disabled={isLoading}
                />
                {otpError && <p className="text-xs text-destructive mt-1">{otpError}</p>}
                <div className="text-center text-xs pt-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled || isLoading}
                    className="p-0 h-auto"
                  >
                     {isResendDisabled ? `Resend OTP in ${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}` : "Resend OTP"}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </Button>
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

    