import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white hover:bg-zinc-800",

        primary:
          "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg",

        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",

        outline:
          "border border-zinc-300 bg-white hover:bg-zinc-100",

        ghost:
          "hover:bg-zinc-100",

        destructive:
          "bg-red-600 text-white hover:bg-red-700",

        link:
          "text-orange-600 underline-offset-4 hover:underline",
      },

      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
