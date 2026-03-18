import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LegalSection {
  title: string;
  body: string;
}

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  summaryTitle: string;
  summaryBody: string;
  sections: LegalSection[];
}

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  summaryTitle,
  summaryBody,
  sections,
}: LegalPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-24 pt-6 md:px-12 md:pt-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(238,63,44,0.22),transparent_18%),radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.08),transparent_12%),radial-gradient(circle_at_18%_72%,rgba(238,63,44,0.14),transparent_18%),radial-gradient(circle_at_82%_72%,rgba(238,63,44,0.14),transparent_18%)]" />
        <div className="absolute inset-x-[18%] bottom-[16%] h-[22rem] rounded-[50%] border border-white/6 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),rgba(0,0,0,0)_70%)] blur-sm" />
        <div className="absolute left-1/2 top-[24%] h-[38%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/26 to-transparent" />
        <div className="absolute left-1/2 top-[34%] h-[28%] w-5 -translate-x-1/2 rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_28%,rgba(0,0,0,0.1)_100%)] opacity-60 blur-[1px]" />
        <div className="absolute left-[22%] top-[54%] h-48 w-48 rounded-full border border-trgt-crimson/12 bg-[radial-gradient(circle,rgba(0,0,0,0.78),rgba(0,0,0,0.92)_62%,transparent_78%)] shadow-[0_0_80px_rgba(238,63,44,0.12)]" />
        <div className="absolute right-[22%] top-[54%] h-48 w-48 rounded-full border border-trgt-crimson/12 bg-[radial-gradient(circle,rgba(0,0,0,0.78),rgba(0,0,0,0.92)_62%,transparent_78%)] shadow-[0_0_80px_rgba(238,63,44,0.12)]" />
        <div className="absolute left-1/2 bottom-[24%] h-24 w-[46%] -translate-x-1/2 rounded-[999px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.18))]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/58 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="glass-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-display uppercase tracking-[0.16em] text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return To Garage
          </Link>
          <span className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
            TRGT Legal
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass relative overflow-hidden rounded-[2rem] border border-border-strong p-8 md:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(238,63,44,0.12),transparent_28%,transparent_72%,rgba(255,255,255,0.04))]" />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-trgt-crimson">{eyebrow}</span>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-lg">
                {intro}
              </p>

              <div className="mt-10 grid gap-4">
                {sections.map((section, index) => (
                  <div
                    key={section.title}
                    className="relative rounded-2xl border border-white/10 bg-black/22 p-5 backdrop-blur-xl"
                  >
                    <div className="absolute left-0 top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-trgt-crimson/70 to-transparent" />
                    <div className="pl-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black uppercase tracking-[0.18em] text-trgt-crimson">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">{section.title}</h2>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{section.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass relative overflow-hidden rounded-[2rem] border border-border-strong p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-trgt-crimson/70 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">Quick Read</span>
              <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white">
                {summaryTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {summaryBody}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="glass rounded-[1.75rem] border border-border-strong p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">Product</span>
                <p className="mt-3 text-base font-black uppercase tracking-[0.08em] text-white">
                  Race intelligence, standings, predictions, badges
                </p>
              </div>
              <div className="glass rounded-[1.75rem] border border-border-strong p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">Service Note</span>
                <p className="mt-3 text-base font-black uppercase tracking-[0.08em] text-white">
                  Live feeds may degrade to cache or local snapshots when upstream services fail
                </p>
              </div>
              <div className="glass rounded-[1.75rem] border border-border-strong p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">Scope</span>
                <p className="mt-3 text-base font-black uppercase tracking-[0.08em] text-white">
                  Fan product, not an official Formula 1 property
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
