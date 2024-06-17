import { and, asc, avg, count, desc, eq, gt, sum } from 'drizzle-orm';
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
  const returnedProducts = await db
    .select({
      id: product.id,
      name: product.name,
      priceInPence: product.priceInPence,
      filePath: product.filePath,
      imagePath: product.imagePath,
      description: product.description,
      isAvailableForPurchase: product.isAvailableForPurchase,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })
    .from(product)
    .where(eq(product.isAvailableForPurchase, true))
    .leftJoin(order, eq(product.id, order.productId))
    .groupBy(product.id)
    .orderBy(desc(count(order.id)))
    .limit(limit);

  return returnedProducts;
}

export async function createProduct(
  name: string,
  description: string,
  priceInPence: number,
  imagePath: string,
  filePath: string
) {
  await db.insert(product).values({
    name,
    description,
    priceInPence,
    imagePath,
    filePath,
    isAvailableForPurchase: false,
  });
}

export async function updateProduct(
  productId: string,
  name: string,
  description: string,
  priceInPence: number,
  imagePath: string,
  filePath: string
) {
  await db
    .update(product)
    .set({ name, description, priceInPence, imagePath, filePath })
    .where(eq(product.id, productId));
}

export async function updateProductAvailability(
  productId: string,
  isAvailableForPurchase: boolean
) {
  await db
    .update(product)
    .set({ isAvailableForPurchase })
    .where(eq(product.id, productId));
}

export async function deleteProduct(id: string) {
  const returnedProduct = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning({
      filePath: product.filePath,
      imagePath: product.imagePath,
    });

  return returnedProduct;
}

// USERS

export async function getUsersForDashboard() {
  const returnedUsers = await db.query.user.findMany({
    columns: {
      id: true,
      email: true,
    },
    with: {
      orders: {
        columns: {
          pricePaidInPence: true,
        },
      },
    },
    orderBy: [desc(user.createdAt)],
  });

  return returnedUsers;
}

export async function deleteUser(id: string) {
  const returnedUser = await db.delete(user).where(eq(user.id, id)).returning({
    id: user.id,
  });

  return returnedUser;
}

// ORDERS

export async function createOrder(
  email: string,
  productId: string,
  pricePaidInPence: number
) {
  const returnedUserId = await db
    .insert(user)
    .values({
      email,
    })
    .onConflictDoUpdate({ target: user.email, set: { email } })
    .returning({
      id: user.id,
    });

  const returnedOrder = await db
    .insert(order)
    .values({
      productId,
      pricePaidInPence,
      userId: returnedUserId[0].id,
    })
    .returning({
      id: order.id,
      pricePaidInPence: order.pricePaidInPence,
      createdAt: order.createdAt,
    });

  return returnedOrder[0];
}

export async function getOrders() {
  const returnedOrders = await db.query.order.findMany({
    columns: {
      id: true,
      pricePaidInPence: true,
    },
    with: {
      product: {
        columns: {
          name: true,
        },
      },
      user: {
        columns: {
          email: true,
        },
      },
    },
    orderBy: [desc(order.createdAt)],
  });

  return returnedOrders;
}

export async function checkOrderExists(email: string, productId: string) {
  const repsonse = await db
    .select({ id: order.id })
    .from(order)
    .leftJoin(user, eq(order.userId, user.id))
    .where(and(eq(order.productId, productId), eq(user.email, email)));

  return repsonse == null;
}

export async function deleteOrder(id: string) {
  const returnedOrder = await db
    .delete(order)
    .where(eq(order.id, id))
    .returning({
      deletedId: order.id,
    });

  return returnedOrder;
}

// DASHBOARD

export async function getSalesData() {
  const returnedData = await db
    .select({
      total: sum(order.pricePaidInPence),
      numberOfSales: count(order.id),
    })
    .from(order);

  return {
    amount: Number(returnedData[0].total) / 100, //Dislike this completely but we'll see
    numberOfSales: returnedData[0].numberOfSales,
  };
}

export async function getUserData() {
  const userCount = await db.select({ userCount: count(user.id) }).from(user);
  const averageValuePerUser = await db
    .select({
      averageValuePerUser: avg(order.pricePaidInPence),
    })
    .from(order);

  return {
    userCount: userCount[0].userCount,
    averageValuePerUser:
      userCount[0].userCount === 0
        ? 0
        : Number(averageValuePerUser[0].averageValuePerUser) / 100,
  };
}

export async function getProductData() {
  const activeCount = await db
    .select({ activeCount: count(product.id) })
    .from(product)
    .where(eq(product.isAvailableForPurchase, true));

  const inactiveCount = await db
    .select({ inactiveCount: count(product.id) })
    .from(product)
    .where(eq(product.isAvailableForPurchase, false));

  return {
    activeCount: Number(activeCount[0].activeCount),
    inactiveCount: Number(inactiveCount[0].inactiveCount),
  };
}

export async function getProductsForDashboard() {
  const returnedProducts = await db
    .select({
      id: product.id,
      name: product.name,
      priceInPence: product.priceInPence,
      isAvailableForPurchase: product.isAvailableForPurchase,
      _count: count(order.productId),
    })
    .from(product)
    .leftJoin(order, eq(product.id, order.productId))
    .groupBy(product.id)
    .orderBy(asc(product.name));

  return returnedProducts;
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
