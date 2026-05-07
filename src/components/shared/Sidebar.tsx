'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  LogOut, 
  Menu,
  X,
  CreditCard,
  Lightbulb,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const hideSidebarRoutes = ['/', '/login', '/signup'];
  if (hideSidebarRoutes.includes(pathname || '')) {
    return null;
  }
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', href: '/onboarding', icon: Wallet },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Learn', href: '/learn', icon: Lightbulb },
    { name: 'Simulator', href: '/simulator', icon: SlidersHorizontal },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar (Visible only on mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-slate-100" />
          <span className="font-semibold text-lg text-slate-100">FinPlan</span>
        </div>
        <button onClick={toggleSidebar} className="text-slate-300 p-2 rounded-lg hover:bg-white/5">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-slate-100" />
          </div>
          <span className="text-xl font-semibold text-slate-100">FinPlan</span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group border
                  ${isActive 
                    ? 'bg-white/5 text-white border-white/10' 
                    : 'border-transparent text-slate-400 hover:bg-white/4 hover:text-slate-200 hover:border-white/5'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User / Auth Area */}
        <div className="p-4 border-t border-white/10">
          {status === 'authenticated' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-200 font-medium">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200 truncate w-32">{session?.user?.name}</span>
                  <span className="text-xs text-slate-500">Premium Member</span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full">
                <Button variant="outline" className="w-full bg-white/2 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="block w-full">
                <Button className="w-full bg-white hover:bg-slate-200 text-[#0A0D14] shadow-none font-semibold rounded-xl">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
