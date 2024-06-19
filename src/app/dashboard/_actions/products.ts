'use server';

import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  updateProductAvailability,
} from '@/db/queries';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInPence: z.coerce.number().int().min(0),
  image: z.string().min(1),
  file: z.string().min(1),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await createProduct(
    data.name,
    data.description,
    data.priceInPence,
    data.image,
    data.file
  );

  revalidatePath('/');
  revalidatePath('/products');
  redirect('/dashboard/products');
}

export async function updateProductAction(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await getProduct(id);
  if (product == null) return notFound();

  if (data.image !== product.imagePath || data.file !== product.filePath) {
    const utapi = new UTApi();

    if (data.image !== product.imagePath)
      // @ts-expect-error
      await utapi.deleteFiles([product.imagePath.split('/').pop()]);

    if (data.file !== product.filePath)
      // @ts-expect-error
      await utapi.deleteFiles([product.filePath.split('/').pop()]);
  }

  await updateProduct(
    id,
    data.name,
    data.description,
    data.priceInPence,
    data.image,
    data.file
  );

  revalidatePath('/');
  revalidatePath('/products');
  redirect('/dashboard/products');
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await updateProductAvailability(id, isAvailableForPurchase);

  revalidatePath('/');
  revalidatePath('/products');
}

export async function deleteProductAction(id: string) {
  const product = await deleteProduct(id);
  if (product == null) return notFound();

  const utapi = new UTApi();
  await utapi.deleteFiles([
    // @ts-expect-error
    product[0].filePath.split('/').pop(),
    // @ts-expect-error
    product[0].imagePath.split('/').pop(),
  ]);

  revalidatePath('/');
  revalidatePath('/products');
}
