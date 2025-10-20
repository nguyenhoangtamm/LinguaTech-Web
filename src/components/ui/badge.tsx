import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        active:
          "border-transparent bg-green-500 text-white shadow-sm hover:bg-green-600",
        inactive:
          "border border-gray-600 bg-gray-400 text-black hover:bg-gray-500",
        outOfStock:
          "border-transparent bg-red-500 text-white flex items-center hover:bg-red-600",
        draft:
          "border-transparent bg-yellow-400 text-black shadow-sm hover:bg-yellow-500",
        featured:
          "border border-purple-500 bg-purple-100 text-purple-900 hover:bg-purple-200",
        discontinued:
          "border-transparent bg-gray-800 text-gray-200 strikethrough hover:bg-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
