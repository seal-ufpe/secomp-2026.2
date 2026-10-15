import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn("h-10 w-full border border-neon bg-navy px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-neon", className)} {...props} />
  ),
);
Select.displayName = "Select";
