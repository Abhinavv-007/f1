import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

const repoHref = "https://github.com/Abhinavv-007/f1";

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-border-subtle/30 bg-black/[0.16] backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto px-6 py-10 md:px-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-display text-xl font-bold tracking-tighter text-white">
              TRGT
            </span>
            <span className="rounded-full border border-trgt-crimson/30 bg-trgt-crimson/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-trgt-crimson font-bold">
              Target Every Lap
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            Live schedule sync, grounded circuit intel, current standings, and prediction tracking built for the part of F1 fandom that actually cares about the details.
          </p>
          <p className="text-xs text-text-muted mt-4">
            © {new Date().getFullYear()} TRGT. Data surfaces are tuned for the 2026 season.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <Link
            href={repoHref}
            target="_blank"
            rel="noreferrer"
            className="glass-button group inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm text-white transition-colors"
          >
            <Github className="w-4 h-4 text-trgt-crimson" />
            <span className="font-bold tracking-wide">Abhinavv-007/f1</span>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-text-muted">
            <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
            <Link href="/stats" className="hover:text-white transition-colors">Circuits</Link>
            <Link href={`${repoHref}/issues`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Issues
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
