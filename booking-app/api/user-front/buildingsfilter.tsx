"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Building } from "@/types/building"

// ── Helpers ──────────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function imgUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
}

function extractItems(payload: unknown): Building[] {
  if (Array.isArray(payload)) return payload as Building[];
  if (payload && typeof payload === "object") {
    for (const key of ["buildings", "data", "items", "results", "docs"]) {
      const val = (payload as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as Building[];
    }
  }
  return [];
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useBuildings() {
  const [allBuildings, setAllBuildings] = useState<Building[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: d } = await axios.get(`${BASE_URL}/api/buildings`, {
          params: { page: 1, limit: 100 },
        });

        const firstPage = extractItems(d);
        const total: number =
          d?.total ?? d?.totalCount ?? d?.count ?? d?.meta?.total ?? firstPage.length;

        if (firstPage.length >= total || !d?.page) {
          if (!cancelled) setAllBuildings(firstPage);
          return;
        }

        const pageSize   = firstPage.length;
        const totalPages = Math.ceil(total / pageSize);

        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            axios
              .get(`${BASE_URL}/api/buildings`, { params: { page: i + 2, limit: pageSize } })
              .then(r => extractItems(r.data))
          )
        );

        if (!cancelled) setAllBuildings([...firstPage, ...rest.flat()]);
      } catch {
        if (!cancelled) setError("Failed to load properties. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { allBuildings, loading, error };
}