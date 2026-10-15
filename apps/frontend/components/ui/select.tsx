import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn("h-11 w-full border-2 border-neon bg-navy px-3 text-foreground outline-none focus:ring-2 focus:ring-neon", className)} {...props} />
  ),
);
Select.displayName = "Select";
