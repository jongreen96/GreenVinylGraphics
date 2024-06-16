'use server';

import {
  createDownloadVerificationId,
  getEmailOrderHistory,
} from '@/db/queries';
import OrderHistory from '@/email/orderHistory';
import { Resend } from 'resend';
import { z } from 'zod';

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function EmailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get('email'));
  if (result.success === false) return { error: 'Invalid email' };

  const user = await getEmailOrderHistory(result.data);
  if (user == null)
    return {
      message:
        'Check your email to view your order history and download links.',
    };

  const orders = user.orders.map(async (order) => {
    return {
      ...order,
      downloadVerificationId: await createDownloadVerificationId(
        order.product.id
      ),
    };
  });

  const data = await resend.emails.send({
    from: `Green Vinyl Graphics <${process.env.RESEND_FROM_EMAIL}>`,
    to: user.email,
    subject: 'Your order history',
    react: OrderHistory({
      orders: await Promise.all(orders),
    }),
  });

  if (data.error) return { error: 'Error sending email, please try again' };

  return {
    message: 'Check your email to view your order history and download links.',
  };
}
