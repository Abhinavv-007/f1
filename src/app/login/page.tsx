"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Mail, ChevronRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[85vh] px-6">
      
      <div className="flex flex-col items-center text-center mb-10">
         <span className="text-trgt-crimson text-xs uppercase tracking-[0.2em] font-bold mb-4 block">Authorization Required</span>
         <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
            Identify Yourself
         </h1>
         <p className="text-text-secondary text-sm max-w-sm">
            Access live telemetry, lock predictions, and establish your global F1 standing.
         </p>
      </div>

      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-md relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-tr from-trgt-crimson/20 via-transparent to-transparent blur-xl rounded-2xl" />
        
        <Card glass carbon className="p-8 bg-black/80 relative z-10 border-border-strong border-t-trgt-crimson">
           
           <div className="flex flex-col gap-4 mb-8">
              {/* Google Auth Mock Button */}
              <button className="w-full h-14 rounded bg-white text-black font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* GitHub Auth Mock Button */}
              <button className="w-full h-14 rounded bg-surface-deep border border-border-strong text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-surface-hover hover:border-white/40 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Deploy with Github
              </button>
           </div>
           
           <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Or Email Override</span>
              <div className="flex-1 h-px bg-border-subtle" />
           </div>

           <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Paddock Pass Identity</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-trgt-crimson transition-colors" />
                    <input 
                      type="email" 
                      placeholder="driver@scuderia.com" 
                      className="w-full h-12 bg-surface-deep border border-border-strong rounded pl-12 pr-4 text-white text-sm focus:outline-none focus:border-trgt-crimson transition-colors placeholder:text-text-muted/50 font-mono"
                    />
                 </div>
              </div>
              <button 
                type="button"
                className="w-full btn-angled bg-trgt-crimson text-white text-[12px] font-black uppercase tracking-[0.1em] py-4 mt-2 hover:bg-trgt-crimson-deep transition-all duration-300 shadow-[0_0_20px_rgba(238,63,44,0.2)] flex justify-center items-center gap-2 group"
              >
                Request Authorization link
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
           </form>
           
           <p className="text-[10px] text-center text-text-muted mt-8 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
              By accessing the telemetry terminal, you agree to the FIA Data <span className="text-white hover:text-trgt-crimson cursor-pointer transition-colors">Terms of Service</span>.
           </p>
        </Card>
      </motion.div>

      <Link href="/" className="mt-8 text-xs text-text-secondary hover:text-white uppercase tracking-widest transition-colors font-bold flex items-center gap-2">
         <ChevronRight className="w-3 h-3 rotate-180" /> Return to Paddock
      </Link>
    </div>
  );
}
