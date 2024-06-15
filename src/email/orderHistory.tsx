import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components';
import React from 'react';
import { OrderInformation } from './components/orderInformation';

type OrderHistoryProps = {
  orders: {
    id: string;
    createdAt: Date;
    pricePaidInPence: number;
    downloadVerificationId: string;
    product: {
      name: string;
      description: string;
      imagePath: string;
    };
  }[];
};

OrderHistory.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInPence: 499,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: 'Test Product',
        description: 'This is a test product',
        imagePath:
          '/products/5cbc7b2b-e6a5-48cf-a970-e5d062b49d3a-Thumbnail-Apple-iPad-Air-M1-5th-Gen-2022-Skin-Template-SVG-Cricut.png',
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInPence: 999,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: 'Test Product 2',
        description: 'This is a test product 2',
        imagePath:
          '/products/bd2dd1fb-c4ef-40f2-bf38-d62feaba7d78-Thumbnail-Apple-AirPod-2nd-Gen-2019-Skin-Template-SVG-Cricut.png',
      },
    },
  ],
} satisfies OrderHistoryProps;

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Html>
      <Preview>Order History & Download Links</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={index}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index !== orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
