'use server';

import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  updateProductAvailability,
} from '@/db/queries';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const fileSchema = z.instanceof(File, { message: 'Required' });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/')
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInPence: z.coerce.number().int().min(0),
  image: imageSchema.refine((file) => file.size > 0, 'Required'),
  file: fileSchema.refine((file) => file.size > 0, 'Required'),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public/${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await createProduct(
    data.name,
    data.description,
    data.priceInPence,
    imagePath,
    filePath
  );

  revalidatePath('/');
  revalidatePath('/products');
  redirect('/dashboard/products');
}

const updateSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProductAction(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = updateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await getProduct(id);
  if (product == null) return notFound();

  let filePath = product.filePath;
  if (data.file !== undefined && data.file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.image !== undefined && data.image.size > 0) {
    await fs.unlink(`public/${product.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public/${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await updateProduct(
    id,
    data.name,
    data.description,
    data.priceInPence,
    imagePath,
    filePath
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

  await fs.unlink(product[0].filePath);
  await fs.unlink(`public/${product[0].imagePath}`);

  revalidatePath('/');
  revalidatePath('/products');
}
