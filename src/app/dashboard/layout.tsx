'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { Toaster } from '@/components/ui/toaster';
import { EmergencyButton } from '@/components/dashboard/emergency-button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };
  
  if (pathname === '/dashboard/sos') {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        side="left"
        variant="sidebar"
        className="border-sidebar-border"
      >
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">
              SafeNav
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard')}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/guardians')}
                tooltip={{ children: 'Guardians' }}
              >
                <Link href="/dashboard/guardians">
                  <Users />
                  <span>Guardians</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/community')}
                tooltip={{ children: 'Community' }}
              >
                <Link href="/dashboard/community">
                  <MessageSquare />
                  <span>Community</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/settings')}
                tooltip={{ children: 'Settings' }}
              >
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2">
            <EmergencyButton />
          </div>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Logout' }}>
                <Link href="/">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto flex items-center gap-4">
              <UserNav />
            </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
