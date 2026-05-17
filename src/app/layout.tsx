import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { BackgroundVideo } from "@/components/layout/BackgroundVideo";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TRGT — Target Every Lap | F1 Predictions, Live Standings & Race Intelligence",
    template: "%s · TRGT",
  },
  description:
    "TRGT is an elite Formula 1 fan platform — live standings, race predictions, circuit stats, driver analytics, and a real-time leaderboard. Play, predict, and follow every lap of the F1 season.",
  metadataBase: new URL("https://trgt.in"),
  keywords: [
    "F1",
    "Formula 1",
    "F1 predictions",
    "F1 fantasy",
    "F1 leaderboard",
    "race predictions",
    "live standings",
    "F1 stats",
    "circuit stats",
    "TRGT",
    "trgt.in",
    "Formula 1 fan platform",
    "F1 prediction game",
  ],
  applicationName: "TRGT",
  authors: [{ name: "Abhinav Raj", url: "https://abhnv.in/" }],
  creator: "Abhinav Raj",
  publisher: "TRGT",
  category: "Sports",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://trgt.in",
    title: "TRGT — Target Every Lap",
    description:
      "An elite Formula 1 fan platform. Live standings, predictions, circuit stats, and race intelligence — all in one place.",
    siteName: "TRGT",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TRGT - Target Every Lap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRGT — Target Every Lap",
    description:
      "An elite Formula 1 fan platform. Live standings, predictions, circuit stats, and race intelligence.",
    site: "@Abhnv8",
    creator: "@Abhnv8",
    images: ["/og-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://trgt.in/#organization",
      "name": "TRGT",
      "url": "https://trgt.in/",
      "logo": "https://trgt.in/og-image.png",
      "founder": {
        "@type": "Person",
        "name": "Abhinav Raj",
        "url": "https://abhnv.in/",
      },
      "sameAs": [
        "https://github.com/Abhinavv-007/f1",
        "https://x.com/Abhnv8",
        "https://www.linkedin.com/in/abhnv07/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://trgt.in/#website",
      "url": "https://trgt.in/",
      "name": "TRGT",
      "description":
        "Elite Formula 1 fan platform with live standings, predictions, circuit stats, and race intelligence.",
      "publisher": { "@id": "https://trgt.in/#organization" },
      "inLanguage": "en",
    },
    {
      "@type": "WebApplication",
      "name": "TRGT",
      "operatingSystem": "Web",
      "applicationCategory": "SportsApplication",
      "description":
        "Predict F1 race outcomes, climb a live leaderboard, follow standings and circuit stats across the season.",
      "url": "https://trgt.in/",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-black text-foreground selection:bg-trgt-crimson selection:text-white"
      >
        <div className="fixed inset-0 z-[-1] bg-black">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(238,63,44,0.26),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_70%_78%,rgba(238,63,44,0.16),transparent_22%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(105deg,rgba(255,255,255,0.022)_0px,rgba(255,255,255,0.022)_2px,transparent_2px,transparent_34px)] opacity-45" />
          <div className="absolute left-[-10%] right-[-10%] top-[16%] h-px bg-gradient-to-r from-transparent via-white/28 to-transparent opacity-70" />
          <div className="absolute left-[-10%] right-[-10%] top-[calc(16%+18px)] h-[1px] bg-gradient-to-r from-transparent via-trgt-crimson/44 to-transparent opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-surface-deep/28 to-black/78" />
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
