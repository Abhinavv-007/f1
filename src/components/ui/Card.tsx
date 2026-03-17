import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  carbon?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, carbon = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border-subtle bg-surface-deep transition-colors hover:border-border-strong",
          glass && "glass",
          className
        )}
        {...props}
      >
        {carbon && (
          <div className="absolute inset-0 carbon-texture opacity-20 pointer-events-none mix-blend-overlay" />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Card.displayName = "Card";

export interface MotionCardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
  carbon?: boolean;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, glass = false, carbon = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border-subtle bg-surface-deep transition-colors hover:border-border-strong shadow-lg shadow-black/50",
          glass && "glass",
          className
        )}
        {...props}
      >
        {carbon && (
          <div className="absolute inset-0 carbon-texture opacity-30 pointer-events-none mix-blend-overlay" />
        )}
        <div className="relative z-10">{children as React.ReactNode}</div>
      </motion.div>
    );
  }
);
MotionCard.displayName = "MotionCard";
