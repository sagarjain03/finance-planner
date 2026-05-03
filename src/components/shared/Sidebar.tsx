'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  Settings, 
  LogOut, 
  Menu,
  X,
  CreditCard
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
    { name: 'Goals', href: '/goals', icon: Target }, // Placeholder for future
    { name: 'Settings', href: '/settings', icon: Settings }, // Placeholder for future
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar (Visible only on mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0B0F17] z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-slate-200" />
          <span className="font-bold text-lg text-slate-200">FinPlan</span>
        </div>
        <button onClick={toggleSidebar} className="text-slate-300 p-2">
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
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0A0D14] border-r border-white/[0.08] flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-200 to-slate-400 flex items-center justify-center shadow-lg shadow-white/10">
            <CreditCard className="w-5 h-5 text-[#0A0D14]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            FinPlan
          </span>
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
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-white/[0.08] text-white shadow-sm' 
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
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
        <div className="p-4 border-t border-white/[0.08]">
          {status === 'authenticated' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-medium">
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
                <Button variant="outline" className="w-full bg-white/[0.02] border-white/[0.1] text-slate-300 hover:bg-white/[0.05] hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="block w-full">
                <Button className="w-full bg-white hover:bg-slate-200 text-[#0A0D14] shadow-[0_0_15px_rgba(255,255,255,0.15)] font-semibold rounded-xl">
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
