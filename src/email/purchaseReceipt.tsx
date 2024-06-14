import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import { OrderInformation } from './components/orderInformation';

type PurchaseReceiptProps = {
  product: {
    name: string;
    description: string;
    imagePath: string;
  };
  order: {
    id: string;
    createdAt: Date;
    pricePaidInPence: number;
  };
  downloadVerificationId: string;
};

PurchaseReceipt.PreviewProps = {
  product: {
    name: 'Test Product',
    description: 'This is a test product',
    imagePath:
      '/products/5cbc7b2b-e6a5-48cf-a970-e5d062b49d3a-Thumbnail-Apple-iPad-Air-M1-5th-Gen-2022-Skin-Template-SVG-Cricut.png',
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInPence: 499,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptProps;

export default function PurchaseReceipt({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view reciept</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
