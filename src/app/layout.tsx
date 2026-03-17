import type { Metadata } from "next";
import { Rubik, Rubik_Mono_One } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const rubikMono = Rubik_Mono_One({
  variable: "--font-rubik-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "TRGT | Target Every Lap",
  description: "An elite Formula 1 fan platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${rubik.variable} ${rubikMono.variable} font-sans antialiased min-h-screen bg-black text-foreground selection:bg-trgt-crimson selection:text-white`}
      >
        <div className="fixed inset-0 z-[-1] bg-black">
          {/* Ambient Video Loop */}
          <video
            src="/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-surface-deep/40 to-black/80" />
        </div>
        
        <div className="relative z-10 flex min-h-screen flex-col">
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
