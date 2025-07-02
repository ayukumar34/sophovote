// React
import { ReactNode } from "react";

// Utils
import { cn } from "@/lib/clsx-handler";

// Types
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className={cn("mx-auto w-full max-w-4xl", className)}>{children}</div>
    </div>
  );
}
