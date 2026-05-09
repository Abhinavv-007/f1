"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "bash",
  filename,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("relative rounded-xl border border-border-strong/60 bg-black/65 backdrop-blur-md overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-white/8 bg-black/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-trgt-crimson/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            {filename ?? language}
          </span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong/70 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary hover:text-white hover:border-trgt-crimson/40 transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-f1-green" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-text-secondary whitespace-pre">
        {code}
      </pre>
    </div>
  );
}
