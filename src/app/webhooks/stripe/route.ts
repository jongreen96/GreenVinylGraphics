import db from '@/db/db';
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

    const product = await db.product.findFirst({
      where: { id: productId },
    });

    if (product === null || email === null)
      return new NextResponse('Product not found', { status: 404 });

    const userFields = {
      email,
      orders: {
        create: { productId, pricePaidInPence },
      },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(
          order.createdAt.getTime() + 1000 * 60 * 60 * 24 * 7
        ),
      },
    });

    await resend.emails.send({
      from: `Support <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: PurchaseReceipt({
        product,
        order,
        downloadVerificationId: downloadVerification.id,
      }),
    });
  }
  return new NextResponse();
}
