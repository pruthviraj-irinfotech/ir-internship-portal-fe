'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "OTP Sent!", description: "A verification code has been sent to your email." });
    setStep(2);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Success!", description: "Your account has been created." });
    // router.push('/') logic would go here
  }

  const handleResendOtp = () => {
    toast({ title: "OTP Resent", description: "A new verification code has been sent." });
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-primary">Create Account</CardTitle>
          <CardDescription>
            {step === 1 ? 'Enter your details to join' : 'Verify your email'}
          </CardDescription>
        </CardHeader>
        {step === 1 ? (
          <form onSubmit={handleNextStep}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Player One" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="player1@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Continue</Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                <Input id="otp" type="text" maxLength={6} placeholder="******" required />
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
        <div className="text-center text-xs text-muted-foreground mb-4">
          Already a player?{' '}
          <Link href="/login" passHref>
            <Button variant="link" className="p-0 h-auto">Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
