/**
 * GET /api/admin/cloudflare
 *
 * Server-side proxy to the Cloudflare REST API. Surfaces the connected
 * token, account, D1 databases, KV namespaces, and Worker scripts on
 * the /admin Vault tab. Token never leaves the worker.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "edge";

const CF_API = "https://api.cloudflare.com/client/v4";

interface CFResponse<T> {
  success: boolean;
  errors?: Array<{ message: string; code: number }>;
  result: T;
}

async function cf<T>(token: string, path: string): Promise<CFResponse<T> | null> {
  try {
    const res = await fetch(`${CF_API}${path}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      cache: "no-store",
    });
    return (await res.json()) as CFResponse<T>;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token || token === "replace-with-your-cloudflare-user-token") {
    return NextResponse.json(
      { ok: false, error: "CLOUDFLARE_API_TOKEN is not set on the worker." },
      { status: 503, headers: { "cache-control": "private, no-store" } },
    );
  }

  const verify = await cf<{ id: string; status: string }>(token, "/user/tokens/verify");
  if (!verify || !verify.success) {
    return NextResponse.json(
      { ok: false, error: verify?.errors?.[0]?.message ?? "Cloudflare rejected the token." },
      { status: 502, headers: { "cache-control": "private, no-store" } },
    );
  }

  const accountsRes = await cf<Array<{ id: string; name: string; type?: string | null }>>(token, "/accounts?per_page=20");
  const accounts = accountsRes?.success ? accountsRes.result : [];
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || accounts[0]?.id || "";

  type D1 = { uuid: string; name: string; created_at?: string; version?: string };
  type KV = { id: string; title: string };
  type Worker = { id: string; modified_on?: string };

  const [d1, kv, workers] = accountId
    ? await Promise.all([
        cf<D1[]>(token, `/accounts/${accountId}/d1/database?per_page=50`),
        cf<KV[]>(token, `/accounts/${accountId}/storage/kv/namespaces?per_page=50`),
        cf<Worker[]>(token, `/accounts/${accountId}/workers/scripts`),
      ])
    : [null, null, null];

  return NextResponse.json(
    {
      ok: true,
      token: { id: verify.result.id, status: verify.result.status },
      account: accounts.find((a) => a.id === accountId) ?? accounts[0] ?? null,
      accountId,
      accounts: accounts.map((a) => ({ id: a.id, name: a.name, type: a.type ?? null })),
      d1: d1?.success ? d1.result : [],
      kv: kv?.success ? kv.result : [],
      workers: workers?.success ? workers.result.map((w) => ({ id: w.id, modified_on: w.modified_on ?? null })) : [],
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
