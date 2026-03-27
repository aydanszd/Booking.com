"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const LOCALES = [
  { code: "en", label: "English",  flag: "https://flagcdn.com/w40/gb.png" },
  { code: "tr", label: "Türkçe",   flag: "https://flagcdn.com/w40/tr.png" },
  { code: "ru", label: "Русский",  flag: "https://flagcdn.com/w40/ru.png" },
];

function readLocaleFromCookie(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  const val = match ? match[1] : "en";
  return ["en", "tr", "ru"].includes(val) ? val : "en";
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  // Start with "en" to avoid hydration mismatch, update after mount
  const [current, setCurrent] = useState("en");

  useEffect(() => {
    setCurrent(readLocaleFromCookie());
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === current) ?? LOCALES[0];

  const switchLocale = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setCurrent(code);
    setOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-white/10 px-2 py-2 rounded transition-colors flex items-center gap-1"
        aria-label="Select language"
      >
        <img
          src={currentLocale.flag}
          alt={currentLocale.label}
          className="w-6 h-6 rounded-full object-cover"
        />
        <ChevronDown size={12} className="text-white/80" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-36">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => switchLocale(locale.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  current === locale.code
                    ? "bg-blue-50 text-[#006ce4] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <img
                  src={locale.flag}
                  alt={locale.label}
                  className="w-5 h-5 rounded-full object-cover"
                />
                {locale.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
