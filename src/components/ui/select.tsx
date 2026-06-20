import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-amber-100",
        className,
      )}
      {...props}
    />
  );
}
