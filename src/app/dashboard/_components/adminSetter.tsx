'use client';

export default function AdminSetter() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin', 'true');
  }

  return null;
}
