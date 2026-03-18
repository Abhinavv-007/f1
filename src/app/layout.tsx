import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRGT | Target Every Lap",
  description: "An elite Formula 1 fan platform. Live standings, predictions, circuit stats, and race intelligence — all in one place.",
  metadataBase: new URL("https://trgt.in"),
  openGraph: {
    type: "website",
    url: "https://trgt.in",
    title: "TRGT | Target Every Lap",
    description: "An elite Formula 1 fan platform. Live standings, predictions, circuit stats, and race intelligence — all in one place.",
    siteName: "TRGT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TRGT - Target Every Lap",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="font-sans antialiased min-h-screen bg-black text-foreground selection:bg-trgt-crimson selection:text-white"
      >
        <div className="fixed inset-0 z-[-1] bg-black">
          <video
            src="/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20 object-center"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(238,63,44,0.2),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.09),transparent_18%),radial-gradient(circle_at_70%_78%,rgba(238,63,44,0.12),transparent_22%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(105deg,rgba(255,255,255,0.018)_0px,rgba(255,255,255,0.018)_2px,transparent_2px,transparent_34px)] opacity-40" />
          <div className="absolute left-[-10%] right-[-10%] top-[16%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60" />
          <div className="absolute left-[-10%] right-[-10%] top-[calc(16%+18px)] h-[1px] bg-gradient-to-r from-transparent via-trgt-crimson/40 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-surface-deep/45 to-black/90" />
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
