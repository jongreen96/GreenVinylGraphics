import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
};

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInPence: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInPence ?? 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInPence: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInPence ?? 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

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
