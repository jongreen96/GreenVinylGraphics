import { and, count, desc, eq, gt } from 'drizzle-orm';
import { db } from './db';
import { downloadVerification, order, product, user } from './schema';

// PRODUCTS

export async function getProduct(id: string) {
  const returnedProduct = await db.query.product.findFirst({
    where: eq(product.id, id),
  });

  return returnedProduct;
}

export async function getAllProducts(limit = 9999) {
  const returnedProducts = await db.query.product.findMany({
    where: eq(product.isAvailableForPurchase, true),
    orderBy: [desc(product.createdAt)],
    limit,
  });

  return returnedProducts;
}

export async function getMostPopularProducts(limit = 9999) {
  const returnedProducts = await db.query.product.findMany({
    where: eq(product.isAvailableForPurchase, true),
    orderBy: [desc(count(order.id))], // Will be MASSIVELY impresses if this works
    limit,
  });

  return returnedProducts;
}

// ORDERS

export async function checkOrderExists(email: string, productId: string) {
  return (
    (await db.query.order.findFirst({
      // TBC
    })) != null
  );
}

// EMAILS

export async function getEmailOrderHistory(email: string) {
  const returnedOrderHistory = await db.query.user.findFirst({
    where: eq(user.email, email),
    columns: {
      email: true,
    },
    with: {
      orders: {
        columns: {
          pricePaidInPence: true,
          id: true,
          createdAt: true,
        },
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  return returnedOrderHistory;
}

// DOWNLOAD VERIFICATION

export async function createDownloadVerificationId(productId: string) {
  const returnedVerificationId = await db
    .insert(downloadVerification)
    .values({
      expiresAt: new Date(Date.now() + 1000 + 60 * 60 * 24),
      productId,
    })
    .returning({
      id: downloadVerification.id,
    });

  return returnedVerificationId[0].id;
}

export async function getDownloadVerificationId(verificationId: string) {
  const returnedVerification = await db.query.downloadVerification.findFirst({
    where: and(
      eq(downloadVerification.id, verificationId),
      gt(downloadVerification.expiresAt, new Date())
    ),
    columns: {},
    with: {
      product: {
        columns: {
          name: true,
          filePath: true,
        },
      },
    },
  });

  return returnedVerification;
}
