"use client";

import { BADGES, BadgeDefinition } from "@/lib/badges";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCaseProps {
  earnedBadgeIds?: string[];
  className?: string;
}

export function BadgeCase({ earnedBadgeIds = [], className }: BadgeCaseProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {BADGES.map((badge) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={cn(
              "relative aspect-square rounded-lg border flex flex-col items-center justify-center gap-2 group cursor-crosshair overflow-hidden transition-all duration-300",
              isEarned
                ? `${badge.bg} ${badge.border}`
                : "border-border-subtle bg-surface-deep opacity-40 grayscale"
            )}
            title={badge.description}
          >
            {isEarned && (
              <div className={cn("absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity to-transparent", badge.bg)} />
            )}
            
            {isEarned ? (
              <>
                <span className="text-2xl relative z-10">{badge.icon}</span>
                <span className="text-[8px] uppercase tracking-wider text-white font-bold text-center px-1 leading-tight relative z-10">
                  {badge.label}
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-text-muted" />
                <span className="text-[8px] uppercase tracking-wider text-text-muted/50 font-bold text-center px-1 leading-tight">
                  {badge.label}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
