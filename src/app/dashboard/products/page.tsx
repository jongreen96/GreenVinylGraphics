import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { getProductsForDashboard } from '@/db/queries';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { CheckCircle2, MoreVertical, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '../_components/pageHeader';
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from './_components/productActions';

export default function DashboardProductsPage() {
  return (
    <main>
      <div className='flex justify-between items-center gap-4'>
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href='/dashboard/products/new'>New Product</Link>
        </Button>
      </div>

      <ProductsTable />
    </main>
  );
}

async function ProductsTable() {
  const products = await getProductsForDashboard();

  if (products.length == 0) {
    return <p>No products found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Available for purchase</span>
          </TableHead>

          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>

          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <CheckCircle2 />
                  <span className='sr-only'>Available for purchase</span>
                </>
              ) : (
                <>
                  <XCircleIcon className='stroke-destructive' />
                  <span className='sr-only'>Not available for purchase</span>
                </>
              )}
            </TableCell>

            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInPence / 100)}</TableCell>
            <TableCell>{formatNumber(product._count)}</TableCell>

            <TableCell className='flex'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <ActiveToggleDropdownItem
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  />

                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      download
                      href={`/dashboard/products/${product.id}/download`}
                    >
                      Download
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
