"use client";

import { type BadgeState } from "@/lib/badges";
import { cn } from "@/lib/utils";
import { Lock, Sparkles } from "lucide-react";

interface BadgeCaseProps {
  badges: BadgeState[];
  className?: string;
}

export function BadgeCase({ badges, className }: BadgeCaseProps) {
  const unlockedCount = badges.filter((badge) => badge.unlocked).length;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
            Garage Inventory
          </span>
          <span className="mt-1 block font-display text-xl font-black uppercase tracking-tight text-white">
            {unlockedCount} / {badges.length} unlocked
          </span>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-f1-yellow/30 bg-f1-yellow/10 text-f1-yellow">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-4 transition-colors",
              badge.unlocked
                ? "border-white/12 bg-white/[0.04]"
                : "border-border-subtle/60 bg-surface-deep/70"
            )}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
              style={{
                background: `linear-gradient(90deg, transparent, ${badge.color}, transparent)`,
              }}
            />

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl",
                  badge.unlocked ? "border-white/15 bg-white/[0.06]" : "border-white/10 bg-black/30 grayscale"
                )}
                style={badge.unlocked ? { boxShadow: `0 0 24px ${badge.color}22` } : undefined}
              >
                {badge.unlocked ? badge.icon : <Lock className="h-5 w-5 text-text-muted" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-black uppercase tracking-tight text-white">
                      {badge.label}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {badge.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
                      badge.unlocked ? "text-white" : "border-white/10 text-text-muted"
                    )}
                    style={
                      badge.unlocked
                        ? {
                            borderColor: `${badge.color}66`,
                            backgroundColor: `${badge.color}22`,
                          }
                        : undefined
                    }
                  >
                    {badge.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.16em]">
                  <span className="text-text-muted">{badge.progressText}</span>
                  <span className={badge.unlocked ? "text-white" : "text-trgt-crimson"}>
                    {badge.statusText}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${badge.progressPercent}%`,
                      background: `linear-gradient(90deg, ${badge.color}, rgba(255,255,255,0.92))`,
                    }}
                  />
                </div>

                {!badge.unlocked && badge.remainingText && (
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-text-muted">
                    {badge.remainingText}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
