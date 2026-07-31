import { useCallback, useMemo } from "react";
import { useCollection, uid, isoDay } from "@/lib/storage";

export type GrowthLog = {
  id: string;
  date: string;
  weightKg: number;
  heightCm: number;
  headCm?: number;
  note?: string;
  createdAt: string;
};

/**
 * useCreateGrowthLog — records a baby growth measurement (weight / height /
 * head circumference) and keeps the log sorted by date.
 */
export function useCreateGrowthLog() {
  const { items, setItems, remove, loading } = useCollection<GrowthLog>("baby:growth", []);

  const createGrowthLog = useCallback(
    (input: {
      date?: string;
      weightKg: number;
      heightCm: number;
      headCm?: number;
      note?: string;
    }) => {
      const log: GrowthLog = {
        id: uid(),
        date: input.date || isoDay(),
        weightKg: Number(input.weightKg) || 0,
        heightCm: Number(input.heightCm) || 0,
        headCm: input.headCm ? Number(input.headCm) : undefined,
        note: input.note?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) =>
        [...prev, log].sort((a, b) => a.date.localeCompare(b.date)),
      );
      return log;
    },
    [setItems],
  );

  const chartData = useMemo(
    () =>
      items.map((l) => ({
        date: l.date.slice(5),
        weight: l.weightKg,
        height: l.heightCm,
      })),
    [items],
  );

  const latest = items.length ? items[items.length - 1] : null;

  return { logs: items, createGrowthLog, deleteGrowthLog: remove, chartData, latest, loading };
}
