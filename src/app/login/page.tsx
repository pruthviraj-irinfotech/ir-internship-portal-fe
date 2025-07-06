'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.push(redirectUrl || '/');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const forgotPasswordHref = redirectUrl ? `/forgot-password?redirect=${redirectUrl}` : '/forgot-password';
  const signupHref = redirectUrl ? `/signup?redirect=${redirectUrl}` : '/signup';

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline text-primary">Login</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="player1@email.com"
                defaultValue="player1@email.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href={forgotPasswordHref} passHref>
                  <Button variant="link" className="p-0 h-auto text-xs">Forgot?</Button>
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Use: password123"
                defaultValue="password123"
                required
                disabled={isLoading}
              />
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              <p>Use <b className="text-primary">player1@email.com</b> and <b className="text-primary">password123</b> to log in.</p>
              <p className="mt-1">Admin: <b className="text-primary">admin@email.com</b> / <b className="text-primary">adminpassword</b>.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Start Quest'}
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              New player?{' '}
              <Link href={signupHref} passHref>
                <Button variant="link" className="p-0 h-auto">Create Account</Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
