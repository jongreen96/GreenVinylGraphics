import { formatCurrency } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

type ProductCardProps = {
  id: string;
  name: string;
  priceInPence: number;
  description: string;
  imagePath: string;
};

export function ProductCard({
  id,
  name,
  priceInPence,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className='flex flex-col overflow-hidden'>
      <div className='relative w-full aspect-square'>
        <Image src={imagePath} fill alt={name} className='object-contain' />
      </div>

      <CardHeader>
        <CardTitle>
          <div className='flex justify-between w-full'>
            <span>{name}</span>
            <span className='font-normal'>
              {formatCurrency(priceInPence / 100)}
            </span>
          </div>
        </CardTitle>

        <CardDescription className='line-clamp-1'>
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className='mt-auto'>
        <Button asChild className='w-full'>
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className='flex flex-col overflow-hidden'>
      <div className='w-full h-auto aspect-square bg-black/15 animate-pulse'></div>

      <CardHeader>
        <CardTitle>
          <div className='flex gap-4 justify-between w-full animate-pulse'>
            <span className='w-full h-5 bg-black/15 rounded'></span>
            <span className='w-14 h-5 bg-black/15 rounded'></span>
          </div>
        </CardTitle>

        <CardDescription className='w-full h-4 bg-black/15 rounded animate-pulse'></CardDescription>
      </CardHeader>

      <CardFooter className='mt-auto'>
        <Button className='w-full' disabled>
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
