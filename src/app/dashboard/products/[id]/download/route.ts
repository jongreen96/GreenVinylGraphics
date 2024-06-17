import { getProduct } from '@/db/queries';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await getProduct(id);

  if (product == null) return notFound();

  return NextResponse.redirect(new URL(product.filePath, req.url));
}
