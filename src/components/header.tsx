
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { FileText, LogOut, Award, User, Briefcase, LayoutDashboard, Menu, Gamepad2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const logoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/avatars/irinfotech-logo.png`;


  if (pathname.startsWith('/admin')) {
    return null;
  }

  const loggedOutLinks = [
    { href: '/', label: 'Open Internships', icon: <Briefcase /> },
    { href: '/verify-certificate', label: 'Verify Certificate', icon: <Award /> },
    { href: '/login', label: 'Login', icon: <User /> },
  ];

  const loggedInLinks = [
    { href: '/', label: 'Open Internships', icon: <Briefcase /> },
    { href: '/applied', label: 'My Applications', icon: <FileText /> },
    { href: '/my-games', label: 'My Games', icon: <Gamepad2 /> },
    { href: '/verify-certificate', label: 'Verify Certificate', icon: <Award /> },
    { href: '/profile', label: 'Profile', icon: <User /> },
  ];

  const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const handleLinkClick = () => {
        if (isMobile) {
            setIsSheetOpen(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        handleLinkClick();
    };

    return (
        <>
            {navLinks.map(({ href, label, icon }) => (
                <Button
                    key={href}
                    variant={pathname.startsWith(href) && href !== '/' || pathname === href ? 'secondary' : 'ghost'}
                    size="sm"
                    asChild
                    className={cn(
                        'text-xs sm:text-sm px-4 sm:px-3 flex items-center gap-1 sm:gap-2',
                        (pathname.startsWith(href) && href !== '/' || pathname === href) && 'shadow-none translate-x-0 translate-y-0',
                        isMobile && 'justify-start text-sm h-12'
                    )}
                    onClick={handleLinkClick}
                >
                    <Link href={href}>
                        {icon}
                        <span className={cn(!isMobile && 'hidden sm:inline-block')}>{label}</span>
                    </Link>
                </Button>
            ))}
            {isLoggedIn && isAdmin && (
                <Button
                    key="/admin"
                    variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'}
                    size="sm"
                    asChild
                    className={cn(
                        'text-xs sm:text-sm px-4 sm:px-3 flex items-center gap-1 sm:gap-2',
                        (pathname.startsWith('/admin')) && 'shadow-none translate-x-0 translate-y-0',
                        isMobile && 'justify-start text-sm h-12'
                    )}
                    onClick={handleLinkClick}
                >
                    <Link href="/admin">
                        <LayoutDashboard />
                        <span className={cn(!isMobile && 'hidden sm:inline-block')}>Admin Panel</span>
                    </Link>
                </Button>
            )}
            {isLoggedIn && (
                <Button variant="ghost" size="sm" onClick={handleLogout} className={cn('text-xs sm:text-sm px-4 sm:px-3 flex items-center gap-1 sm:gap-2', isMobile && 'justify-start text-sm h-12')}>
                    <LogOut />
                    <span className={cn(!isMobile && 'hidden sm:inline-block')}>Logout</span>
                </Button>
            )}
        </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <Image src={logoUrl} alt="Company Logo" width={40} height={40} data-ai-hint="logo" />
          <span className="font-headline text-lg hidden sm:inline-block">IR Intern Portal</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavContent />
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setIsSheetOpen(false)}>
                        <Image src={logoUrl} alt="Company Logo" width={40} height={40} data-ai-hint="logo" />
                        <span className="font-headline text-lg">IR Intern Portal</span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                       <NavContent isMobile />
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
