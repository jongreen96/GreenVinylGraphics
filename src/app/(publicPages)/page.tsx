import { ProductCard, ProductCardSkeleton } from '@/components/productCard';
import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { Product } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className='space-y-12'>
      <ProductGridSection
        productFetcher={getNewestProducts}
        title='Newest Products'
      />
      <ProductGridSection
        productFetcher={getMostPopularProducts}
        title='Most Popular'
      />
    </main>
  );
}

function getNewestProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
}

function getMostPopularProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: 'desc' } },
    take: 8,
  });
}

type ProductGridSectionProps = {
  productFetcher: () => Promise<Product[]>;
  title: string;
};

function ProductGridSection({
  productFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <section className='space-y-4'>
      <div className='flex gap-4 justify-between'>
        <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
        <Button asChild variant='outline'>
          <Link href='/products' className='space-x-2'>
            <span>View All</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>

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
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </section>
  );
}

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
