
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpError, setOtpError] = useState('');

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to send OTP.");
      }
      
      toast({ title: "OTP Sent!", description: "Check your email for a password reset code." });
      setStep(2);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpError('');
    setIsLoading(true);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to reset password.");
        }

        toast({ title: "Success!", description: "Your password has been reset. Please login." });
        const loginHref = redirectUrl ? `/login?redirect=${redirectUrl}` : '/login';
        router.push(loginHref);
    } catch (error: any) {
         toast({ title: "Error", description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
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
                <Input
                  id="email"
                  type="email"
                  placeholder="player1@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
              </Button>
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
                  disabled={isLoading}
                />
                {otpError && <p className="text-xs text-destructive mt-1">{otpError}</p>}
                <div className="text-center text-xs pt-2">
                    <Button
                        type="button"
                        variant="link"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="p-0 h-auto"
                    >
                       Resend OTP
                    </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                    </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
              </Button>
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
