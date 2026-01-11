'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { Toaster } from '@/components/ui/toaster';

export default function GuardianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <Link href="/dashboard/guardian" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6" />
                <span className="">Her-Way Guardian</span>
            </Link>
            <div className="ml-auto flex items-center gap-4">
              <UserNav />
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
        </main>
        <Toaster />
    </div>
  );
}
