import Nav, { NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav>
        <NavLink href='/dashboard'>Dashboard</NavLink>
        <NavLink href='/dashboard/products'>Products</NavLink>
        <NavLink href='/dashboard/users'>Users</NavLink>
        <NavLink href='/dashboard/orders'>Orders</NavLink>
      </Nav>

      <div className='my-6 container'>{children}</div>
    </>
  );
}
