import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-transparent px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-[#FADBD8] text-[#D9383A]",
        success:
          "bg-[#E2F1ED] text-[#146C5B]",
        warning:
          "bg-[#FDEBD0] text-[#D67E10]",
        outline:
          "border-border bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  const getDotClass = () => {
    switch (variant) {
      case "warning":
        return "bg-[#D67E10]";
      case "destructive":
        return "bg-[#D9383A]";
      case "success":
        return "bg-[#146C5B]";
      default:
        return "bg-current";
    }
  };

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {(variant === "success" || variant === "warning" || variant === "destructive") && (
        <span className={cn("w-2 h-2 rounded-full shrink-0", getDotClass())} />
      )}
      <span>{children}</span>
    </Comp>
  )
}

export { Badge, badgeVariants }
