import { LegalPageShell } from "@/components/legal/LegalPageShell";

const sections = [
  {
    title: "What TRGT Stores",
    body:
      "TRGT stores the minimum account, sign-in, badge, and prediction data needed to let you enter the product, lock race picks, track points, and keep your season history consistent.",
  },
  {
    title: "What TRGT Uses",
    body:
      "Session, standings, and circuit surfaces are powered by external motorsport data feeds together with local fallback snapshots. Those feeds are used to keep race information timely and visible throughout the product.",
  },
  {
    title: "Your Control",
    body:
      "If you stop using TRGT, the retained data is limited to the profile and prediction history needed for account continuity and rankings. The product UI is not built around ad-tech or noisy tracking layers.",
  },
  {
    title: "Authentication",
    body:
      "When you sign in, TRGT uses the authentication details needed to identify your account and connect predictions, badges, and profile state to the right user.",
  },
  {
    title: "Operational Logging",
    body:
      "Basic platform logs may exist for uptime, debugging, or API reliability, especially when upstream race feeds fail and the app needs to recover into cached or local snapshot mode.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Policy"
      title="Privacy Policy"
      intro="TRGT keeps the data model lean: account continuity, prediction state, badge progress, and the live race surfaces needed to run the experience without loading the product with irrelevant tracking."
      summaryTitle="Minimal by design"
      summaryBody="The product is built to store what it needs to operate the race experience and little else: identity, predictions, scoring state, and the data required to keep your season history coherent."
      sections={sections}
    />
  );
}
