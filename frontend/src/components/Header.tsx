'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="p-4 flex justify-between items-center border-b">
      <Link href="/" className="text-2xl sm:text-md font-bold sm:font-semibold">Post Comments App</Link>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-md font-semibold">{user.username}</span>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="space-x-2">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};