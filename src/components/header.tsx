'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { InnoHireIcon } from '@/components/icons';
import { FileText, LogOut, Award, User, Briefcase, Play, CaseSensitive } from 'lucide-react';
import { useFont } from '@/context/font-context';

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const { toggleFont } = useFont();

  const loggedOutLinks = [
    { href: '/', label: 'Open Internships', icon: <Briefcase /> },
    { href: '/verify-certificate', label: 'Verify Certificate', icon: <Award /> },
    { href: '/login', label: 'Login', icon: <User /> },
  ];

  const loggedInLinks = [
    { href: '/', label: 'Open Internships', icon: <Briefcase /> },
    { href: '/applied', label: 'Applied', icon: <FileText /> },
    { href: '/ongoing', label: 'Ongoing', icon: <Play /> },
    { href: '/verify-certificate', label: 'Verify Certificate', icon: <Award /> },
    { href: '/profile', label: 'Profile', icon: <User /> },
  ];

  const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <InnoHireIcon className="w-8 h-8 text-primary" />
          <span className="font-headline text-lg hidden sm:inline-block">IR Intern Portal</span>
        </Link>
        <nav className="flex-1 flex items-center justify-end space-x-1 sm:space-x-2">
          {navLinks.map(({ href, label, icon }) => (
            <Button
              key={href}
              variant={pathname === href ? 'secondary' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                'text-xs sm:text-sm px-2 sm:px-3 flex items-center gap-1 sm:gap-2',
                pathname === href && 'shadow-none translate-x-0 translate-y-0'
              )}
            >
              <Link href={href}>
                {icon}
                <span className="hidden sm:inline-block">{label}</span>
              </Link>
            </Button>
          ))}
          {isLoggedIn && (
            <Button variant="ghost" size="sm" onClick={logout} className="text-xs sm:text-sm px-2 sm:px-3 flex items-center gap-1 sm:gap-2">
              <LogOut />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={toggleFont} className="text-xs sm:text-sm px-2 sm:px-3 flex items-center gap-1 sm:gap-2">
            <CaseSensitive />
            <span className="hidden sm:inline-block">Font</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
