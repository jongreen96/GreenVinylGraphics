import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProductData, getSalesData, getUserData } from '@/db/queries';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <Link href='/dashboard/orders'>
        <DashboardCard
          title='Sales'
          subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
          body={formatCurrency(salesData.amount)}
        />
      </Link>

      <Link href='/dashboard/users'>
        <DashboardCard
          title='Customers'
          subtitle={`${formatCurrency(
            userData.averageValuePerUser
          )} Average customer revenue`}
          body={formatNumber(userData.userCount)}
        />
      </Link>

      <Link href='/dashboard/products'>
        <DashboardCard
          title='Active Products'
          subtitle={`${formatNumber(
            productData.inactiveCount
          )} Inactive products`}
          body={formatNumber(productData.activeCount)}
        />
      </Link>
    </main>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
