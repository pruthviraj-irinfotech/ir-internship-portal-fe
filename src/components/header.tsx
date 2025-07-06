'use client';

import Link from 'next/link';
import { InnoHireIcon, CertificateIcon, UserIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/verify-certificate', label: 'Verify Certificate', icon: <CertificateIcon className="w-4 h-4" /> },
  { href: '/login', label: 'Login', icon: <UserIcon className="w-4 h-4" /> },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <InnoHireIcon className="w-8 h-8 text-primary" />
          <span className="font-headline text-lg hidden sm:inline-block">IR Intern Portal</span>
        </Link>
        <nav className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
          {navLinks.map(({ href, label, icon }) => (
            <Button
              key={href}
              variant={pathname === href ? 'secondary' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                'text-xs sm:text-sm',
                pathname === href && 'shadow-none translate-x-0 translate-y-0'
              )}
            >
              <Link href={href}>
                {icon}
                <span className="hidden sm:inline-block">{label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
