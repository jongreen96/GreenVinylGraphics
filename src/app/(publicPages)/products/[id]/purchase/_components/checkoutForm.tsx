'use client';

import { userOrderExists } from '@/app/actions/orders';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/db/schema';
import { formatCurrency } from '@/lib/formatters';
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { useState } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutForm({
  product,
  clientSecret,
}: {
  product: Product;
  clientSecret: string;
}) {
  return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
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
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInPence={product.priceInPence} productId={product.id} />
      </Elements>
    </div>
  );
}

function Form({
  priceInPence,
  productId,
}: {
  priceInPence: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    // Check for existing order
    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        'You already have an order for this product. Re download it from the My Orders page.'
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className='text-destructive'>
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <PaymentElement />
          <Separator className='my-4' />
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </CardContent>

        <CardFooter>
          <Button
            disabled={!stripe || !Elements || isLoading}
            size='lg'
            className='w-full'
          >
            {isLoading
              ? 'Purchasing...'
              : `Purchase - ${formatCurrency(priceInPence / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
