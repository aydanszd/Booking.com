import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "tr", "ru"] as const;
const DEFAULT_LOCALE = "en";

function getLocaleFromPath(pathname: string): string | null {
  for (const locale of LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const localeInPath = getLocaleFromPath(pathname);

  if (localeInPath) {
    const pathWithoutLocale =
      pathname === `/${localeInPath}`
        ? "/"
        : pathname.slice(`/${localeInPath}`.length);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathWithoutLocale);

    const response = NextResponse.rewrite(
      new URL(pathWithoutLocale + search, request.url),
      { request: { headers: requestHeaders } }
    );
    response.cookies.set("locale", localeInPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // No locale prefix — redirect to /{locale}/...
  const cookieLocale = request.cookies.get("locale")?.value;
  const locale =
    (LOCALES as readonly string[]).includes(cookieLocale ?? "")
      ? cookieLocale!
      : DEFAULT_LOCALE;

  return NextResponse.redirect(
    new URL(`/${locale}${pathname}${search}`, request.url),
    { status: 307 }
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)" ],
};
