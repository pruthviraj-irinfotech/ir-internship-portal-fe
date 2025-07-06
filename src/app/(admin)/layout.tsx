'use client';

import * as React from 'react';
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
import { usePathname } from 'next/navigation';
import { Upload, Eye, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin/view-certificates',
      label: 'View Certificates',
      icon: <Eye className="w-5 h-5" />,
    },
    {
      href: '/admin/upload-certificate',
      label: 'Upload Certificate',
      icon: <Upload className="w-5 h-5" />,
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
