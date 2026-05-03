'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Login successful, redirect to onboarding or dashboard
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md glass-card rounded-2xl shadow-2xl p-8 relative z-10 border border-white/[0.05]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to your finance planner</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/[0.1] bg-white/[0.02] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white/[0.3] focus:border-white/[0.3] disabled:bg-white/[0.01] disabled:cursor-not-allowed transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/[0.1] bg-white/[0.02] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white/[0.3] focus:border-white/[0.3] disabled:bg-white/[0.01] disabled:cursor-not-allowed transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-400 text-[#0A0D14] font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/[0.05]">
          <p className="text-slate-400 text-sm text-center">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-white hover:text-slate-200 font-semibold underline underline-offset-4 decoration-white/30"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
