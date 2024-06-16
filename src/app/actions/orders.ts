'use server';

import { checkOrderExists } from '@/db/queries';

export async function userOrderExists(email: string, productId: string) {
  return await checkOrderExists(email, productId);
}
