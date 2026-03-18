"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost" | "pill" | "glass";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center overflow-hidden font-display uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-trgt-crimson/50 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "glass-button bg-[linear-gradient(135deg,rgba(238,63,44,0.64),rgba(238,63,44,0.26)_42%,rgba(0,0,0,0.5)_100%)] text-white border-trgt-crimson/30",
      ghost: "glass-button text-white",
      pill: "glass-button rounded-full text-white px-6",
      glass: "glass-button text-white",
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
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" aria-hidden="true" />
        <span className="relative z-10">{children as ReactNode}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
