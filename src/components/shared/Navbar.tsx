'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:shadow-slate-900/50 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-700 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-600 dark:hover:from-indigo-400 dark:hover:to-purple-400 transition-all"
        >
          FinPlan
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Home
          </Link>

          {status === 'authenticated' && (
            <>
              <Link
                href="/onboarding"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                Plan
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <span className="text-sm text-slate-600 dark:text-slate-400">{session?.user?.name}</span>
              <ThemeToggle />
              <Button
                onClick={() => signOut({ callbackUrl: '/login' })}
                variant="outline"
                size="sm"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Logout
              </Button>
            </>
          )}

          {status === 'unauthenticated' && (
            <>
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
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
