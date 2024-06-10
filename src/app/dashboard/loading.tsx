import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className='flex w-full h-[90svh] items-center justify-center'>
      <Loader2 className='animate-spin size-24' />
    </div>
  );
}
