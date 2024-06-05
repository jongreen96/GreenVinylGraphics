export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <h1 className='text-3xl font-semibold tracking-tighter mb-4'>{children}</h1>
  );
}
