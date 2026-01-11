import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://img.sanishtech.com/u/68927ef3d27b6c22d414c8fa470a64e5.jpeg"
      alt="Her-Way Logo"
      width={100}
      height={100}
      className={cn('rounded-full', className)}
    />
  );
}
