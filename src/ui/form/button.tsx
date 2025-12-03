import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        black: "bg-black text-white shadow-xs hover:bg-black/60",
        secondary: "bg-secondary hover:bg-secondary/60",
        transparent: "bg-transparent text-white hover:bg-black/80",
        outline: "bg-transparent border border-secondary",
        red: "bg-red-500 text-secondary shadow-xs hover:bg-red-600",
      },
      size: {
        default: "h-[56px] px-[10px] py-[24px]",
        medium: "h-[38px]",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "black",
      size: "default",
    },
  },
);

type TProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({ className, variant, size, asChild = false, loading = false, ...props }: TProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "rounded-[12px]",
        buttonVariants({ variant, size, className }),
        "cursor-pointer",
      )}
      {...props}
    >
      {loading ? <Loader2Icon className="animate-spin w-[18px]! h-[18px]!" /> : props.children}
    </Comp>
  );
}

export { Button, buttonVariants };
