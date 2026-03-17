import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-black/80 backdrop-blur-md px-6 py-8 md:px-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-xl font-bold tracking-tighter text-text-secondary">
          TRGT
        </span>
        <span className="text-text-muted text-sm">
          © {new Date().getFullYear()} Target Every Lap.
        </span>
      </div>
      
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <Link href="#" className="hover:text-white transition-colors">Twitter (X)</Link>
        <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
        <span className="text-border-subtle">|</span>
        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
      </div>
    </footer>
  );
}
