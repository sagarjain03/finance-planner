import { CreditCard, Wifi } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CreditCardWidgetProps {
  goalAmount: number;
  userName: string;
}

export function CreditCardWidget({ goalAmount, userName }: CreditCardWidgetProps) {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden group shadow-2xl shadow-blue-900/20">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-[#0B0F17] to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-500/20 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
      
      {/* Card Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-slate-200" />
            </div>
            <span className="text-sm font-semibold tracking-wider text-slate-300">FINPLAN</span>
          </div>
          <Wifi className="w-6 h-6 text-slate-400 rotate-90" />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Target Goal</p>
          <p className="text-3xl font-black text-white tracking-tight">
            {formatCurrency(goalAmount)}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Cardholder</p>
            <p className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              {userName || 'Premium Member'}
            </p>
          </div>
          <div className="flex items-center">
            {/* Fake Mastercard-like logo */}
            <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen" />
            <div className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-screen -ml-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
