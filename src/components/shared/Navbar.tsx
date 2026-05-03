'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-600 transition-all"
        >
          Finance Planner
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>

          {status === 'authenticated' && (
            <>
              <Link
                href="/onboarding"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Plan
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <span className="text-sm text-slate-600">{session?.user?.name}</span>
              <Button
                onClick={() => signOut({ callbackUrl: '/login' })}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </>
          )}

          {status === 'unauthenticated' && (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
