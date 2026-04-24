import { NextRequest, NextResponse } from "next/server";

// Dəstəklənən dillər və default dil
const LOCALES = ["en", "tr", "ru"] as const;
const DEFAULT_LOCALE = "en";

// URL-in əvvəlində dil prefiksi olub-olmadığını yoxlayır
// Məs: "/tr/hotels" → "tr", "/hotels" → null
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
    // URL-dən dil prefiksini çıxarırıq
    // Məs: "/tr/hotels" → "/hotels", "/tr" → "/"
    const pathWithoutLocale =
      pathname === `/${localeInPath}`
        ? "/"
        : pathname.slice(`/${localeInPath}`.length);

    // Prefikssiz path-i header-ə yazırıq ki, server component-lər oxuya bilsin.
    // Bu Next.js-in "rewrite" zamanı orijinal path-i itirməməsi üçün lazımdır.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathWithoutLocale);

    // rewrite: URL brauzerdə dəyişmir ("/tr/hotels" görünür),
    // amma Next.js faktiki olaraq "/hotels" page-ini render edir.
    // redirect-dən fərqi: istifadəçi URL-dəki dili görməyə davam edir.
    const response = NextResponse.rewrite(
      new URL(pathWithoutLocale + search, request.url),
      { request: { headers: requestHeaders } }
    );

    // Seçilmiş dili 1 il müddətinə cookie-də saxlayırıq
    // ki, növbəti ziyarətdə eyni dil avtomatik açılsın
    response.cookies.set("locale", localeInPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // URL-də dil prefiksi yoxdursa — istifadəçini düzgün dil prefiksinə yönləndiririk.
  // Əvvəlcə cookie-dəki dili oxuyuruq, yoxdursa default "en" götürürük.
  // Məs: "/hotels" → "/en/hotels" (və ya cookie-dəki dilə görə "/tr/hotels")
  const cookieLocale = request.cookies.get("locale")?.value;
  const locale =
    (LOCALES as readonly string[]).includes(cookieLocale ?? "")
      ? cookieLocale!
      : DEFAULT_LOCALE;

  // 307 Temporary Redirect — GET metodunu qoruyur (301-dən fərqli olaraq)
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}${search}`, request.url),
    { status: 307 }
  );
}

// matcher: middleware-nin hansı route-lara tətbiq olunacağını müəyyən edir.
// _next/static, _next/image, favicon.ico, api/ və uzantılı fayllar (*.png, *.svg)
// middleware-dən keçirilmir — bunlara dil routing lazım deyil, performans üçün vacibdir.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)" ],
};
