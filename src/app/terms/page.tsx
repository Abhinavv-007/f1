import { LegalPageShell } from "@/components/legal/LegalPageShell";

const sections = [
  {
    title: "Use Of TRGT",
    body:
      "TRGT is a fan product for race tracking, predictions, and standings. The platform is informational and recreational; it is not an official Formula 1 service or rights-holder product.",
  },
  {
    title: "Predictions And Scores",
    body:
      "Prediction scoring, badge unlocks, and leaderboard positions depend on the race data available to the app. When upstream feeds fail, cached or local snapshots may be used to keep the product operating.",
  },
  {
    title: "Accounts",
    body:
      "You are responsible for activity under your sign-in. Accounts may be limited or removed if they are used to disrupt rankings, abuse the service, or automate actions in ways the product does not support.",
  },
  {
    title: "Availability",
    body:
      "TRGT depends on third-party data providers, hosting infrastructure, and authentication services. Availability can change without notice, and some surfaces may fall back to cached or snapshot content during outages.",
  },
  {
    title: "Conduct",
    body:
      "Use the product in good faith. Attempts to manipulate scoring, spam account systems, or degrade the experience for other users can lead to access limits or removal.",
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms"
      title="Terms Of Service"
      intro="These terms define the basic use of TRGT as a race-intelligence and prediction product, including how scoring, availability, and account behavior are handled inside the platform."
      summaryTitle="Built for race mode"
      summaryBody="TRGT is designed for live-session awareness, predictions, and standings. That means some product behavior depends on external data feeds and fallback logic when those feeds fail."
      sections={sections}
    />
  );
}
