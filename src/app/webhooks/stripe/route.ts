import {
  createDownloadVerificationId,
  createOrder,
  getProduct,
} from '@/db/queries';
import PurchaseReceipt from '@/email/purchaseReceipt';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('Stripe-Signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object;
    const productId = charge.metadata.product_id;
    const email = charge.billing_details.email;
    const pricePaidInPence = charge.amount;

    const product = await getProduct(productId);

    if (product == null || email == null)
      return new NextResponse('Product not found', { status: 404 });

    const order = await createOrder(email, productId, pricePaidInPence);

    const downloadVerification = await createDownloadVerificationId(productId);

    await resend.emails.send({
      from: `Green Vinyl Graphics <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: PurchaseReceipt({
        product,
        order,
        downloadVerificationId: downloadVerification,
      }),
    });
  }
  return new NextResponse();
}
