import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrders } from '@/db/queries';
import { formatCurrency } from '@/lib/formatters';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '../_components/pageHeader';
import { DeleteDropDownItem } from './_components/orderActions';

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrderTable />
    </>
  );
}

async function OrderTable() {
  const orders = await getOrders();
  if (orders.length === 0) return <p>No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/products/${order.product.id}`}>
                {order.product.name}
              </Link>
            </TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInPence / 100)}
            </TableCell>
            <TableCell className='text-center'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DeleteDropDownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
