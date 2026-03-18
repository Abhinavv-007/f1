"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Github } from "lucide-react";

const navLinks = [
  { name: "Live", href: "/live" },
  { name: "Predict", href: "/predict" },
  { name: "Standings", href: "/standings" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Stats", href: "/stats" },
  { name: "Profile", href: "/profile" },
];

const repoHref = "https://github.com/Abhinavv-007/f1";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-black/55 backdrop-blur-2xl">
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

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href={repoHref}
              target="_blank"
              rel="noreferrer"
              className="glass-button inline-flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-white"
            >
              <Github className="w-4 h-4" />
            </Link>
            {user ? (
              <Link href="/profile" className="w-10 h-10 rounded-full overflow-hidden border border-border-strong hover:border-trgt-crimson transition-colors">
                <Image
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || "F1"}`}
                  alt="User"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <Link href="/login" className="glass-button inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-display uppercase tracking-[0.18em] text-white transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>

        <nav aria-label="Primary navigation" className="overflow-x-auto md:overflow-visible">
          <div className="glass flex min-w-max items-center gap-1 rounded-full p-1 md:mx-auto md:w-fit">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2.5 text-xs md:text-sm font-medium transition-colors rounded-full uppercase tracking-[0.18em]",
                    isActive ? "text-white" : "text-text-secondary hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-surface-hover"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-3 justify-self-end">
          <Link
            href={repoHref}
            target="_blank"
            rel="noreferrer"
            className="glass-button inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-display uppercase tracking-[0.18em] text-white transition-colors"
          >
            <Github className="w-4 h-4 text-trgt-crimson" />
            Repo
          </Link>

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
                className="text-[10px] text-text-muted hover:text-white uppercase tracking-widest font-bold"
              >
                Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="glass-button inline-flex h-9 items-center justify-center rounded-sm px-4 text-xs font-display uppercase tracking-widest text-white transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/predict"
            className="glass-button inline-flex h-9 items-center justify-center rounded-sm bg-[linear-gradient(135deg,rgba(238,63,44,0.68),rgba(238,63,44,0.28)_42%,rgba(0,0,0,0.54)_100%)] px-4 text-xs font-display uppercase tracking-widest text-white transition-colors"
          >
            Lock Prediction
          </Link>
        </div>
      </div>
    </header>
  );
}
