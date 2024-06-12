import db from '@/db/db';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import CheckoutForm from './_components/checkoutForm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  if (product === null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInPence,
    currency: 'gbp',
    metadata: {
      product_id: product.id,
    },
  });

  if (paymentIntent.client_secret === null) {
    throw new Error('Payment intent client secret is null');
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
