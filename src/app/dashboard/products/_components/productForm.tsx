'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';
import { addProduct } from '../../_actions/products';

export function ProductForm() {
  const [priceInPence, setPriceInPence] = useState<number>();

  return (
    <form action={addProduct} className='space-y-4'>
      <div className='space-y-1'>
        <Label htmlFor='name'>Name</Label>
        <Input type='text' id='name' name='name' required />
      </div>

      <div className='space-y-1'>
        <div className='flex justify-between'>
          <Label htmlFor='price-in-pence'>Price in pence</Label>
          <span className='text-muted-foreground text-sm'>
            {formatCurrency((priceInPence || 0) / 100)}
          </span>
        </div>
        <Input
          type='number'
          id='price-in-pence'
          name='price-in-pence'
          value={priceInPence}
          onChange={(e) => setPriceInPence(Number(e.target.value) || undefined)}
          required
        />
      </div>

      <div className='space-y-1'>
        <Label htmlFor='description'>Description</Label>
        <Textarea id='description' name='description' required />
      </div>

      <div className='space-y-1'>
        <Label htmlFor='image'>Image</Label>
        <Input type='file' id='image' name='image' required />
      </div>

      <div className='space-y-1'>
        <Label htmlFor='file'>File</Label>
        <Input type='file' id='file' name='file' required />
      </div>

      <Button type='submit'>Save</Button>
    </form>
  );
}
