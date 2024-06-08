import { PageHeader } from '@/app/dashboard/_components/pageHeader';
import db from '@/db/db';
import { ProductForm } from '../../_components/productForm';

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  return (
    <main>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </main>
  );
}
