import { Metadata } from 'next';
import MyOrderes from './_components/myOrders';

export const metadata: Metadata = {
  title: 'Orders',
};

export default function MyOrderesPage() {
  return <MyOrderes />;
}
