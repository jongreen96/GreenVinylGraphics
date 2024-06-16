'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteOrderAction } from '../../_actions/orders';

export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteOrderAction(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
