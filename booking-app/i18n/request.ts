import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const SUPPORTED_LOCALES = ["en", "tr", "ru"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value ?? "en";
  const locale: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(raw)
    ? (raw as Locale)
    : "en";

  const filePath = path.join(process.cwd(), "messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return { locale, messages };
});
