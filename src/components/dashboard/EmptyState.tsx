'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function EmptyState() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
      <Card className="w-full max-w-md border-2 border-slate-300">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">No Financial Plan Yet</CardTitle>
          <CardDescription className="text-base">
            {session?.user?.name
              ? `Welcome, ${session.user.name}! `
              : ''}
            Create your first financial plan to see your dashboard with charts and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => router.push('/onboarding')}
            className="w-full h-12 text-base"
          >
            Create Plan →
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="outline"
            className="w-full"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
