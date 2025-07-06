
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "OTP Sent!", description: "Check your email for a password reset code." });
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpError('');

    toast({ title: "Success!", description: "Your password has been reset. Please login." });
    const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';
    router.push(loginHref);
  };

  const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-primary">Reset Password</CardTitle>
          <CardDescription>
            {step === 1 ? 'Enter your email to get an OTP' : 'Create a new password'}
          </CardDescription>
        </CardHeader>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="player1@email.com" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Send OTP</Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
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
                />
                {otpError && <p className="text-xs text-destructive mt-1">{otpError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                    <Input id="new-password" type={showPassword ? 'text' : 'password'} required />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                    </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Reset Password</Button>
            </CardFooter>
          </form>
        )}
        <div className="text-center text-xs text-muted-foreground mb-4">
          Remembered it?{' '}
          <Link href={loginHref} passHref>
            <Button variant="link" className="p-0 h-auto">Back to Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
