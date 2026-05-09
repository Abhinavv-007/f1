import type { Metadata } from "next";
import { ApiDocsClient } from "./ApiDocsClient";

export const metadata: Metadata = {
  title: "Pit Lane · TRGT API",
  description:
    "TRGT public + admin API reference, with sticky TOC, copy-paste examples, and an in-browser playground.",
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
