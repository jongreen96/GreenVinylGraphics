'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export default function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className='font-semibold bg-secondary sticky top-0 tracking-tight shadow-lg'>
      <div className='container flex justify-between'>
        <Link href='/' className='tracking-tighter py-2 text-2xl font-bold '>
          <p className='hidden sm:block'>Green Vinyl Graphics</p>
          <p className='sm:hidden'>GVG</p>
        </Link>
        <div className='flex items-center flex-wrap gap-x-4 justify-end'>
          {children}
        </div>
      </div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        'decoration-2 underline-offset-4 hover:underline focus-visible:underline',
        pathname === props.href && 'underline'
      )}
    />
  );
}
