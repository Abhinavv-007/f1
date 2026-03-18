import Link from "next/link";

const sections = [
  {
    title: "Use Of TRGT",
    body:
      "TRGT is a fan product for race tracking, predictions, and standings. The platform is informational and recreational; it is not an official Formula 1 service.",
  },
  {
    title: "Predictions And Scores",
    body:
      "Prediction scoring, accuracy badges, and leaderboard positions depend on the race data available to the app. When upstream feeds fail, cached or local snapshots may be used to keep the product working.",
  },
  {
    title: "Accounts",
    body:
      "You are responsible for activity under your sign-in. Accounts may be limited or removed if they are used to disrupt rankings, abuse the service, or automate actions in ways the product does not support.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-24 pt-8 md:px-12">
      <div className="glass rounded-3xl border border-border-strong p-8 md:p-12">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-trgt-crimson">Terms</span>
        <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
          Terms Of Service
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-lg">
          These terms cover the basic use of TRGT as a race-intelligence and prediction product.
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
