import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

const repoHref = "https://github.com/Abhinavv-007/f1";
const creatorLinks = [
  { label: "abhnv.in", href: "https://abhnv.in" },
  { label: "abhnv.me", href: "https://abhnv.me" },
  { label: "lnch.in", href: "https://lnch.in" },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-border-subtle/30 bg-black/[0.16] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 px-6 py-12 text-center md:px-12">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold tracking-tighter text-white">TRGT</span>
          <span className="rounded-full border border-trgt-crimson/30 bg-trgt-crimson/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-trgt-crimson">
            Target Every Lap
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-2xl font-medium tracking-tight text-white md:text-4xl">
            A project by{" "}
            <span className="font-serif italic text-[#d9a25f]">Abhinav</span>
          </p>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-text-secondary md:text-xl">
            Race-first Formula 1 intelligence. Your grid, your calls, your control room.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm text-white md:text-[15px]">
          <Link href="/privacy" className="transition-colors hover:text-trgt-crimson">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-trgt-crimson">
            Terms of Service
          </Link>
          <Link
            href={repoHref}
            target="_blank"
            rel="noreferrer"
            className="glass-button group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-colors"
          >
            <Github className="h-4 w-4 text-trgt-crimson" />
            <span>f1</span>
            <ArrowUpRight className="h-4 w-4 text-text-muted transition-colors group-hover:text-white" />
          </Link>
          {creatorLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-trgt-crimson"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} TRGT. Data surfaces tuned for the 2026 season.
        </p>
      </div>
    </footer>
  );
}
