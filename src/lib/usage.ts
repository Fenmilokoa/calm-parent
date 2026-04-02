const STORAGE_KEY = "calm-parent-usage";

export function getUsageDisplay(): { count: number; date: string } {
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

export function setUsageFromServer(remaining: number, freeDaily = 5): void {
  if (typeof window === "undefined") return;
  try {
    const count = freeDaily - remaining;
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: today }));
  } catch {}
}
