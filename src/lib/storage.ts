import { useCallback, useEffect, useState } from "react";

const PREFIX = "wakasafe:";

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("wakasafe:store", { detail: { key } }));
  } catch {
    /* storage full or unavailable */
  }
}

/** SSR-safe localStorage-backed state. Hydrates after mount. */
export function useStore<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setValue(readStore<T>(key, initial));
    setLoading(false);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string }>).detail;
      if (!detail || detail.key === key) setValue(readStore<T>(key, initial));
    };
    window.addEventListener("wakasafe:store", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("wakasafe:store", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeStore(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return { value, setValue: update, loading };
}

/** Collection helper for list-shaped records. */
export function useCollection<T extends { id: string }>(key: string, seed: T[] = []) {
  const { value, setValue, loading } = useStore<T[]>(key, seed);

  const add = useCallback(
    (item: Omit<T, "id"> & { id?: string }) => {
      const record = { ...item, id: item.id ?? uid() } as T;
      setValue((prev) => [record, ...prev]);
      return record;
    },
    [setValue],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) =>
      setValue((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [setValue],
  );

  const remove = useCallback(
    (id: string) => setValue((prev) => prev.filter((r) => r.id !== id)),
    [setValue],
  );

  const clear = useCallback(() => setValue([]), [setValue]);

  return { items: value, add, update, remove, clear, loading, setItems: setValue };
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const naira = (amount: number) =>
  "₦" + Math.round(amount).toLocaleString("en-NG");

/** Lagos / Abuja time — WAT (UTC+1). */
export function watNow() {
  return new Date();
}

export function watTime(date: Date = new Date()) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  }).format(date);
}

export function watDate(date: Date | string = new Date()) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Africa/Lagos",
  }).format(d);
}

export function isoDay(d: Date = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function exportJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
