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
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const performLogin = (email: string, password: string) => {
    setIsLoading(true);

    setTimeout(() => {
      const loginResult = login(email, password);

      if (loginResult === 'admin') {
        router.push('/admin');
      } else if (loginResult === 'user') {
        router.push(redirectUrl || '/');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500); // Shortened for faster testing
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    performLogin(email, password);
  };

  const handleTestLogin = (role: 'user' | 'admin') => {
    const email = role === 'user' ? 'player1@email.com' : 'admin@email.com';
    const password = role === 'user' ? 'password123' : 'adminpassword';
    performLogin(email, password);
  }

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
               <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Use: password123"
                  defaultValue="password123"
                  required
                  disabled={isLoading}
                />
                 <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              <p>Use <b className="text-primary">player1@email.com</b> and <b className="text-primary">password123</b> to log in.</p>
              <p className="mt-1">Admin: <b className="text-primary">admin@email.com</b> / <b className="text-primary">adminpassword</b>.</p>
            </div>

            <div className="text-xs text-center text-muted-foreground pt-4 border-t mt-4">
              <p className="font-medium mb-2">For testing purposes:</p>
              <div className="flex justify-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleTestLogin('user')} disabled={isLoading}>
                    Login as User
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleTestLogin('admin')} disabled={isLoading}>
                    Login as Admin
                </Button>
              </div>
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
