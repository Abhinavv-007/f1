"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost" | "pill";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-display uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-trgt-crimson/50 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-trgt-crimson text-white hover:bg-trgt-crimson-deep hover:shadow-[0_0_20px_rgba(238,63,44,0.3)] border border-trgt-crimson-deep/50",
      ghost: "bg-surface-elevated text-white border border-border-subtle hover:bg-surface-hover hover:border-border-strong glass",
      pill: "rounded-full bg-surface-elevated text-white border border-border-subtle hover:bg-surface-hover px-6 backdrop-blur-md",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], variant !== "pill" && "rounded-sm", className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
