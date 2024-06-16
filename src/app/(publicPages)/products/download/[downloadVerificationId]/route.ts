import { getDownloadVerificationId } from '@/db/queries';
import fs from 'fs/promises';
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

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const extension = data.product.filePath.split('.').pop();

  return new Response(file, {
    headers: {
      'Content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
      'Content-Length': size.toString(),
    },
  });
}
