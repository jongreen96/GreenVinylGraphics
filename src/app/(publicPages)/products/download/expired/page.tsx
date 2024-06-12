import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExpiredPage() {
  return (
    <div className='flex flex-col w-full h-[90svh] items-center justify-center'>
      <p className='text-4xl font-semibold tracking-tight'>Download Expired</p>
      <Button asChild className='mt-4'>
        <Link href='/orders'>Get New Link</Link>
      </Button>
    </div>
  );
}
