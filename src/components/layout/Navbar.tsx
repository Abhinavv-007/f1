"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
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
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12 backdrop-blur-xl bg-black/40 border-b border-border-subtle transition-all">
      {/* Left: Wordmark + Live Dot */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-bold tracking-tighter text-white">
            TRGT
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trgt-crimson opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-trgt-crimson"></span>
          </span>
        </Link>
      </div>

      {/* Center: Pill Nav */}
      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
        <div className="glass flex items-center gap-1 rounded-full p-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium transition-colors rounded-full",
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

      {/* Right: Auth / Live CTA */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-12 h-6 animate-pulse bg-surface-hover rounded hidden md:block" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-border-strong hover:border-trgt-crimson transition-colors">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || "F1"}`} alt="User" className="w-full h-full object-cover" />
            </Link>
            <button onClick={() => signOut(auth)} className="text-[10px] text-text-muted hover:text-white uppercase tracking-widest font-bold hidden md:block">
              Out
            </button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Sign In
            </Button>
          </Link>
        )}
        <Link href="/predict">
          <Button variant="primary" size="sm">
            Lock Prediction
          </Button>
        </Link>
      </div>
    </header>
  );
}
