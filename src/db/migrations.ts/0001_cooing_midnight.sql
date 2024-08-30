ALTER TABLE "download_verification" RENAME TO "gvg_download_verification";--> statement-breakpoint
ALTER TABLE "order" RENAME TO "gvg_order";--> statement-breakpoint
ALTER TABLE "product" RENAME TO "gvg_product";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "gvg_user";--> statement-breakpoint
ALTER TABLE "gvg_user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "gvg_download_verification" DROP CONSTRAINT "download_verification_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "gvg_order" DROP CONSTRAINT "order_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "gvg_order" DROP CONSTRAINT "order_product_id_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gvg_download_verification" ADD CONSTRAINT "gvg_download_verification_product_id_gvg_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."gvg_product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gvg_order" ADD CONSTRAINT "gvg_order_user_id_gvg_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gvg_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gvg_order" ADD CONSTRAINT "gvg_order_product_id_gvg_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."gvg_product"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "gvg_user" ADD CONSTRAINT "gvg_user_email_unique" UNIQUE("email");