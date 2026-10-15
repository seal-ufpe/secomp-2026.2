import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("h-10 w-full border border-neon bg-navy px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-neon", className)} {...props} />
  ),
);
Input.displayName = "Input";
