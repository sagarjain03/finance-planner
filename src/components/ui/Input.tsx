import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-white/[0.1] bg-[#0A0D14]/80 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 transition-all duration-200 focus-visible:outline-none focus-visible:border-white/[0.3] focus-visible:bg-[#0B0F17] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/[0.02]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
