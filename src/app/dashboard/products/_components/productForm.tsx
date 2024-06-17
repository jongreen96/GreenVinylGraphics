'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/db/schema';
import { formatCurrency } from '@/lib/formatters';
import { UploadDropzone } from '@/lib/utils';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addProduct, updateProductAction } from '../../_actions/products';

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProductAction.bind(null, product.id),
    {}
  );
  const [priceInPence, setPriceInPence] = useState<number | undefined>(
    product?.priceInPence
  );
  const [imagePath, setImagePath] = useState<string | undefined>(
    product?.imagePath
  );
  const [filePath, setFilePath] = useState<string | undefined>(
    product?.filePath
  );

  return (
    <form action={action} className='space-y-4'>
      <div className='space-y-1'>
        <Label htmlFor='name'>Name</Label>
        <Input
          type='text'
          id='name'
          name='name'
          required
          defaultValue={product?.name || ''}
        />
        {error.name && <p className='text-sm text-destructive'>{error.name}</p>}
      </div>

      <div className='space-y-1'>
        <div className='flex justify-between'>
          <Label htmlFor='priceInPence'>Price in pence</Label>
          <span className='text-muted-foreground text-xs'>
            {formatCurrency((priceInPence || 0) / 100)}
          </span>
        </div>
        <Input
          type='number'
          id='priceInPence'
          name='priceInPence'
          value={priceInPence}
          onChange={(e) => setPriceInPence(Number(e.target.value) || undefined)}
          required
          defaultValue={product?.priceInPence || 0}
        />
        {error.priceInPence && (
          <p className='text-sm text-destructive'>{error.priceInPence}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          name='description'
          required
          defaultValue={product?.description || ''}
        />
        {error.description && (
          <p className='text-sm text-destructive'>{error.description}</p>
        )}
      </div>

      <div className='space-y-1'>
        <div className='flex justify-between'>
          <Label htmlFor='image'>Image</Label>
          <p className='text-xs text-muted-foreground'>
            {imagePath != null && imagePath}
          </p>
        </div>
        <input type='hidden' id='image' name='image' value={imagePath} />
        <UploadDropzone
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            setImagePath(res[0].url);
          }}
        />
        {error.image && (
          <p className='text-sm text-destructive'>{error.image}</p>
        )}
      </div>

      <div className='space-y-1'>
        <div className='flex justify-between'>
          <Label htmlFor='file'>File</Label>
          <p className='text-xs text-muted-foreground'>
            {filePath != null && filePath}
          </p>
        </div>
        <input type='hidden' id='file' name='file' value={filePath} />
        <UploadDropzone
          endpoint='fileUploader'
          onClientUploadComplete={(res) => {
            setFilePath(res[0].url);
          }}
        />
        {error.file && <p className='text-sm text-destructive'>{error.file}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}
