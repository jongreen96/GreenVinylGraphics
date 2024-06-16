import { InferSelectModel, relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// SCHEMA
export const product = pgTable('product', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  priceInPence: integer('price_in_pence').notNull(),
  filePath: text('file_path').notNull(),
  imagePath: text('image_path').notNull(),
  description: text('description').notNull(),
  isAvailableForPurchase: boolean('is_available_for_purchase')
    .default(true)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

export const order = pgTable('order', {
  id: uuid('id').defaultRandom().primaryKey(),
  pricePaidInPence: integer('price_paid_in_pence').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),

  userId: uuid('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id')
    .references(() => product.id, { onDelete: 'restrict' })
    .notNull(),
});

export const downloadVerification = pgTable('download_verification', {
  id: uuid('id').defaultRandom().primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  productId: uuid('product_id')
    .references(() => product.id, { onDelete: 'cascade' })
    .notNull(),
});

// RELATIONS
export const userRelations = relations(user, ({ one, many }) => {
  return {
    orders: many(order),
  };
});

export const orderRelations = relations(order, ({ one, many }) => {
  return {
    user: one(user, {
      fields: [order.userId],
      references: [user.id],
    }),
    product: one(product, {
      fields: [order.productId],
      references: [product.id],
    }),
  };
});

export const productRelations = relations(product, ({ one, many }) => {
  return {
    downloadVerifications: many(downloadVerification),
    orders: many(order),
  };
});

export const downloadVerificationRelations = relations(
  downloadVerification,
  ({ one, many }) => {
    return {
      product: one(product, {
        fields: [downloadVerification.productId],
        references: [product.id],
      }),
    };
  }
);

// TYPES
export type Product = InferSelectModel<typeof product>;
export type User = InferSelectModel<typeof user>;
export type Order = InferSelectModel<typeof order>;
export type DownloadVerification = InferSelectModel<
  typeof downloadVerification
>;
