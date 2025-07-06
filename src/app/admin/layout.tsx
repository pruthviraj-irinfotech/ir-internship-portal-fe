'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Briefcase, Users, Award, User, LayoutDashboard, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect if not logged in or not an admin.
    if (!isLoggedIn || !isAdmin) {
      router.replace('/login?redirect=' + pathname);
    }
  }, [isLoggedIn, isAdmin, router, pathname]);

  // Render a loading state while auth state is being determined or redirecting
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen w-full">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Verifying credentials...</p>
          </div>
      </div>
    );
  }

  const navItems = [
    {
      href: '/admin/internships',
      label: 'Internships',
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      href: '/admin/ongoing-interns',
      label: 'Ongoing Interns',
      icon: <Users className="w-5 h-5" />,
    },
    {
      href: '/admin/certificates',
      label: 'Certificates Issued',
      icon: <Award className="w-5 h-5" />,
    },
    {
      href: '/admin/profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center gap-2 p-4">
                <LayoutDashboard className="w-8 h-8 text-primary"/>
                <h2 className="text-xl font-headline group-data-[collapsible=icon]:hidden">Admin Panel</h2>
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 md:p-8">
                 {children}
            </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
