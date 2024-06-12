import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.metadata.product_id === null) return notFound();

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.product_id },
  });
  if (product === null) return notFound();

  const isSuccess = paymentIntent.status === 'succeeded';

  return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
      <h1 className='text-4xl font-semibold tracking-tight'>
        {isSuccess ? 'Payment Successful!' : 'Error'}
      </h1>
      <div className='flex gap-4 items-center'>
        <div className='relative w-1/3 aspect-square flex-shrink-0'>
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            className='object-cover'
          />
        </div>

        <div className='text-lg'>
          {formatCurrency(product.priceInPence / 100)}
          <h1 className='text-2xl font-semibold'>{product.name}</h1>
          <div className='text-muted-foreground text-sm line-clamp-3 max-w-prose'>
            {product.description}
          </div>

          <Button asChild className='mt-4 w-full'>
            {isSuccess ? (
              <a>Download Product</a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
