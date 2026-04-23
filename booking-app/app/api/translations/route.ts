import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCALES = ["en", "tr", "ru"] as const;
type Locale = (typeof LOCALES)[number];

function getFilePath(locale: Locale) {
  return path.join(process.cwd(), "messages", `${locale}.json`);
}

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return false;

  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const user = await res.json();
    return user?.role === "admin";
  } catch {
    return false;
  }
}

function flattenObj(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null) {
      Object.assign(result, flattenObj(v as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(v);
    }
  }
  return result;
}

function unflattenObj(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let cur: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== "object") {
        cur[parts[i]] = {};
      }
      cur = cur[parts[i]] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value;
  }
  return result;
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) return unauthorized();

  const data: Record<string, Record<string, string>> = {};
  for (const locale of LOCALES) {
    const raw = fs.readFileSync(getFilePath(locale), "utf-8");
    data[locale] = flattenObj(JSON.parse(raw));
  }
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdmin(req))) return unauthorized();

  const body = await req.json();
  for (const locale of LOCALES) {
    if (!body[locale]) continue;
    const nested = unflattenObj(body[locale]);
    fs.writeFileSync(
      getFilePath(locale),
      JSON.stringify(nested, null, 2),
      "utf-8"
    );
  }
  return NextResponse.json({ ok: true });
}
