import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { FontProvider } from '@/context/font-context';

export const metadata: Metadata = {
  title: 'IR Intern Portal',
  description: 'Verify certificates and find your next internship.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <FontProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Toaster />
          </AuthProvider>
        </FontProvider>
      </body>
    </html>
  );
}
