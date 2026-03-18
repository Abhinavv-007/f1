"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Mail, ChevronRight, Loader2 } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("Authentication is not configured.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in as:", result.user.displayName);
      window.location.href = "/profile";
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to authenticate with Google.");
    } finally {
      setIsLoading(false);
    }
  };

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
           
           <div className="flex flex-col gap-4 mb-4">
              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center">
                  {error}
                </div>
              )}
              {/* Google Auth Button */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 rounded bg-white text-black font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
           </div>
           
           <div className="flex items-center gap-4 mb-4 mt-8">
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
