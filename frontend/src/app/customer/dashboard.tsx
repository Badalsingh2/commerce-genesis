'use client';
import { useUserRole } from '@/hooks/useUserRole';

export default function UserDashboard({ firstName }: { firstName: string }) {
  const role = useUserRole();

  if (role !== 'customer') {
    return <p>Access Denied</p>;
  }

  return <div>Welcome, {firstName}!</div>;
}
