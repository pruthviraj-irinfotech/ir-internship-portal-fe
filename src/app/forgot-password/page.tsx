'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "OTP Sent!", description: "Check your email for a password reset code." });
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Success!", description: "Your password has been reset. Please login." });
    // router.push('/login') logic would go here
  };

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
                <Input id="otp" type="text" maxLength={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Reset Password</Button>
            </CardFooter>
          </form>
        )}
        <div className="text-center text-xs text-muted-foreground mb-4">
          Remembered it?{' '}
          <Link href="/login" passHref>
            <Button variant="link" className="p-0 h-auto">Back to Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
