import { ProductCard, ProductCardSkeleton } from '@/components/productCard';
import db from '@/db/db';
import { Suspense } from 'react';

function getProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default function ProductsPage() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
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
  );
}

async function ProductSuspense() {
  const products = await getProducts();

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
