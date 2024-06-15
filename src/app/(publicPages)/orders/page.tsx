'use client';

import { EmailOrderHistory } from '@/actions/orders';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';

export default function MyOrderesPage() {
  const [data, action] = useFormState(EmailOrderHistory, {});
  return (
    <form action={action} className='max-w-xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we will email your order history and download
            links.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='flex gap-4'>
              <Input type='email' id='email' name='email' required />
              <SubmitButton disabled={!!data.message} />
            </div>

            {data.error && <p className='text-destructive'>{data.error}</p>}
            {data.message && <p className='text-center'>{data.message}</p>}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending || disabled}>
      {disabled ? 'Sent' : pending ? 'Sending...' : 'Send'}
    </Button>
  );
}
