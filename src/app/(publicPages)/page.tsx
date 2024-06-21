import { ProductCard, ProductCardSkeleton } from '@/components/productCard';
import { Button } from '@/components/ui/button';
import { getAllProducts, getMostPopularProducts } from '@/db/queries';
import { Product } from '@/db/schema';
import { cache } from '@/lib/cache';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const getNewestProducts = cache(
  () => getAllProducts(8),
  ['/', 'getNewestProducts'],
  { revalidate: 60 * 60 * 24 }
);

const getMostPopularProduct = cache(
  () => getMostPopularProducts(8),
  ['/', 'getMostPopularProducts'],
  { revalidate: 60 * 60 * 24 }
);

export default function HomePage() {
  return (
    <main className='space-y-12'>
      <ProductGridSection
        productFetcher={getNewestProducts}
        title='Newest Products'
      />
      <ProductGridSection
        productFetcher={getMostPopularProduct}
        title='Most Popular'
      />
    </main>
  );
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
