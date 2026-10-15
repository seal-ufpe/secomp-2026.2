import * as React from "react";
import { cn } from "@/lib/utils";

export function BlockText({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("inline-block bg-magenta px-3 py-2 text-4xl font-black leading-none tracking-[-0.08em] text-neon sm:text-6xl", className)} {...props} />;
}
