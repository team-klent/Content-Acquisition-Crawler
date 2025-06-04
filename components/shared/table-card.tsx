'use client';

import { cn } from '@/lib/utils';

export default function TableCard({
  children,
  className = '',
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        'max-w-full bg-white rounded-3xl ring-1 ring-gray-200 shadow-md py-5 flex flex-col space-y-2 px-4',
        className
      )}
    >
      {children}
    </div>
  );
}
