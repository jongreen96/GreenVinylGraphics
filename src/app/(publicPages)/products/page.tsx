import { PageHeader } from '@/app/dashboard/_components/pageHeader';
import { ProductCard, ProductCardSkeleton } from '@/components/productCard';
import { getAllProducts } from '@/db/queries';
import { cache } from '@/lib/cache';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Products',
};

const getProducts = cache(() => getAllProducts(), ['/products', 'getProducts']);

export default function ProductsPage() {
  return (
    <>
      <PageHeader>All Products</PageHeader>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        <Suspense
          fallback={
            <>
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </>
          }
        >
          <ProductSuspense />
        </Suspense>
      </div>
    </>
  );
}

async function ProductSuspense() {
  const products = await getProducts();

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
