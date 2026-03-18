"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
  { name: "Live", href: "/live" },
  { name: "Predict", href: "/predict" },
  { name: "Standings", href: "/standings" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Stats", href: "/stats" },
  { name: "Profile", href: "/profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-black/[0.44] shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-3xl">
      <div className="max-w-[1600px] mx-auto px-4 py-4 md:px-12 flex flex-col gap-4 md:grid md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center justify-between gap-4 md:justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-display text-2xl font-bold tracking-tighter text-white">
              TRGT
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trgt-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-trgt-crimson"></span>
            </span>
            <span className="hidden lg:inline-flex rounded-full border border-border-strong bg-surface-deep/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              Race Ops
            </span>
          </Link>
        </div>

        <nav aria-label="Primary navigation" className="md:overflow-visible">
          <div className="grid grid-cols-2 gap-2 md:mx-auto md:flex md:min-w-max md:w-fit md:items-center">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "glass-button topbar-button inline-flex min-h-11 items-center justify-center rounded-full border px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors md:min-h-0 md:px-4 md:text-sm md:tracking-[0.18em]",
                    isActive
                      ? "topbar-button-active"
                      : "border-border-strong/70 text-text-secondary hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="grid grid-cols-2 gap-2 md:hidden">
          {loading ? (
            <>
              <div className="h-11 animate-pulse rounded-full bg-surface-hover" />
              <div className="h-11 animate-pulse rounded-full bg-surface-hover" />
            </>
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="glass-button topbar-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[11px] font-display uppercase tracking-[0.16em] text-white transition-colors"
              >
                <Image
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || "F1"}`}
                  alt="User"
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] rounded-full object-cover"
                />
                User
              </Link>
              <button
                onClick={() => auth && signOut(auth)}
                className="glass-button topbar-button inline-flex h-11 items-center justify-center rounded-full px-4 text-[11px] font-display uppercase tracking-[0.16em] text-white transition-colors"
              >
                Out
              </button>
              <Link
                href="/predict"
                className="glass-button topbar-button topbar-button-active col-span-2 inline-flex h-11 items-center justify-center rounded-full px-4 text-[11px] font-display uppercase tracking-[0.16em] text-white transition-colors"
              >
                Lock Prediction
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="glass-button topbar-button inline-flex h-11 items-center justify-center rounded-full px-4 text-[11px] font-display uppercase tracking-[0.16em] text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/predict"
                className="glass-button topbar-button topbar-button-active inline-flex h-11 items-center justify-center rounded-full px-4 text-[11px] font-display uppercase tracking-[0.16em] text-white transition-colors"
              >
                Lock Prediction
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3 justify-self-end">
          {loading ? (
            <div className="w-12 h-6 animate-pulse bg-surface-hover rounded" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-border-strong hover:border-trgt-crimson transition-colors">
                <Image
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || "F1"}`}
                  alt="User"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </Link>
              <button
                onClick={() => auth && signOut(auth)}
                className="glass-button topbar-button inline-flex h-9 items-center justify-center rounded-full px-4 text-[10px] font-display uppercase tracking-[0.2em] text-white transition-colors"
              >
                Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="glass-button topbar-button inline-flex h-9 items-center justify-center rounded-sm px-4 text-xs font-display uppercase tracking-widest text-white transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/predict"
            className="glass-button topbar-button topbar-button-active inline-flex h-9 items-center justify-center rounded-sm bg-[linear-gradient(135deg,rgba(238,63,44,0.68),rgba(238,63,44,0.28)_42%,rgba(0,0,0,0.54)_100%)] px-4 text-xs font-display uppercase tracking-widest text-white transition-colors"
          >
            Lock Prediction
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-36px] h-10 bg-gradient-to-b from-black/[0.36] via-black/[0.16] to-transparent"
      />
    </header>
  );
}
