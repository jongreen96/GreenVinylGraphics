import { PageHeader } from '../../_components/pageHeader';
import { ProductForm } from '../_components/productForm';

export default function NewProductPage() {
  return (
    <main>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </main>
  );
}
