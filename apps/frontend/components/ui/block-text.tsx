import * as React from "react";
import { cn } from "@/lib/utils";

export function BlockText({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("inline-block bg-magenta px-4 py-2 text-4xl font-black leading-none text-neon sm:text-6xl", className)} {...props} />;
}
