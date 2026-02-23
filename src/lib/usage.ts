const STORAGE_KEY = "calm-parent-usage";
const DAY_MS = 24 * 60 * 60 * 1000;

export function getUsage(): { count: number; date: string } {
  if (typeof window === "undefined")
    return { count: 0, date: new Date().toISOString().slice(0, 10) };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: new Date().toISOString().slice(0, 10) };
    const { count, date } = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (date !== today) return { count: 0, date: today };
    return { count: Number(count) || 0, date };
  } catch {
    return { count: 0, date: new Date().toISOString().slice(0, 10) };
  }
}

export function incrementUsage(): void {
  if (typeof window === "undefined") return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const current = getUsage();
    const newCount =
      current.date === today ? current.count + 1 : 1;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ count: newCount, date: today })
    );
  } catch {
    // ignore
  }
}
