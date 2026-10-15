import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("h-11 w-full border-2 border-neon bg-navy px-3 text-foreground outline-none focus:ring-2 focus:ring-neon", className)} {...props} />
  ),
);
Input.displayName = "Input";
