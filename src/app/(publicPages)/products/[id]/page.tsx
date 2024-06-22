import { ProductCard, ProductCardSkeleton } from '@/components/productCard';
import { Button } from '@/components/ui/button';
import { getMostPopularProducts, getProduct } from '@/db/queries';
import { Product } from '@/db/schema';
import { cache } from '@/lib/cache';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-static';

const getMostPopularProduct = cache(
  () => getMostPopularProducts(6),
  ['/', 'product', 'getMostPopularProducts'],
  { revalidate: 60 * 60 * 24 }
);

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);
  if (product == null) return notFound();

  return (
    <main className='grid grid-cols-1 gap-12'>
      <section className='grid sm:grid-cols-3 gap-4 grid-cols-1'>
        <div className='relative w-full aspect-square sm:col-span-2'>
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className='object-cover'
          />
        </div>

        <div className='flex flex-col justify-center gap-2'>
          <h1 className='text-3xl tracking-tight font-semibold'>
            {product.name}
          </h1>
          <p className='text-2xl'>
            {formatCurrency(product.priceInPence / 100)}
          </p>
          <Button asChild size='lg'>
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
          </Button>
        </div>
      </section>

      <section className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>Description</h2>
          <p className='text-muted-foreground text-sm whitespace-pre-wrap'>
            {product.description}
          </p>
        </div>

        <div>
          <h2 className='text-2xl font-semibold tracking-tight mb-2'>
            Popular Products
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Suspense
              fallback={
                <>
                  {[...Array(6)].map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </>
              }
            >
              <ProductSuspense productFetcher={getMostPopularProduct} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
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
