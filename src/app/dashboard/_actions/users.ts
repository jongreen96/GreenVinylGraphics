'use server';

import { deleteUser } from '@/db/queries';
import { notFound } from 'next/navigation';

export async function deleteUserAction(id: string) {
  const user = await deleteUser(id);
  if (user == null) return notFound();

  return user;
}
