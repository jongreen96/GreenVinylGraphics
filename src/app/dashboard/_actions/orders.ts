'use server';

import { deleteOrder } from '@/db/queries';
import { notFound } from 'next/navigation';

export async function deleteOrderAction(id: string) {
  const order = await deleteOrder(id);
  if (order == null) return notFound();

  return order;
}
