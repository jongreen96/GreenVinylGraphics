import { getDownloadVerificationId } from '@/db/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await getDownloadVerificationId(downloadVerificationId);
  if (data == null)
    return NextResponse.redirect(
      new URL('/products/download/expired', req.url)
    );

  return NextResponse.redirect(new URL(data.product.filePath, req.url));
}
