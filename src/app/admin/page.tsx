import type { Metadata } from "next";
import { AdminClient } from "./AdminClient";

export const metadata: Metadata = {
  title: "Race Ops · TRGT",
  description:
    "TRGT admin pit wall — telemetry, drivers, race control, Cloudflare vault, audit.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
