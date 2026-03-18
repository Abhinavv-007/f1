import Link from "next/link";

const sections = [
  {
    title: "What TRGT Stores",
    body:
      "TRGT stores the minimum account and prediction data needed to let you sign in, lock race picks, track points, and unlock badges across the season.",
  },
  {
    title: "What TRGT Uses",
    body:
      "Session, standings, and circuit surfaces are powered by external motorsport data feeds and local snapshots. Those feeds are used to keep race information timely and visible across the app.",
  },
  {
    title: "Your Control",
    body:
      "If you stop using the app, your account remains limited to the stored profile and prediction history needed for leaderboard continuity. No ad-tech or third-party tracking layer is added in the product UI.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-24 pt-8 md:px-12">
      <div className="glass rounded-3xl border border-border-strong p-8 md:p-12">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-trgt-crimson">Policy</span>
        <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-lg">
          TRGT is built to keep the product lean: race data, predictions, badges, and profile continuity without unnecessary noise.
        </p>

        <div className="mt-10 grid gap-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <h2 className="text-lg font-black uppercase tracking-[0.08em] text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="glass-button inline-flex h-11 items-center justify-center rounded-full px-5 text-xs font-display uppercase tracking-[0.16em] text-white transition-colors"
          >
            Return To Garage
          </Link>
        </div>
      </div>
    </div>
  );
}
