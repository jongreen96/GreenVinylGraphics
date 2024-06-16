import { PageHeader } from '@/app/dashboard/_components/pageHeader';
import { getProduct } from '@/db/queries';
import { ProductForm } from '../../_components/productForm';

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);
  return (
    <main>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </main>
  );
}
