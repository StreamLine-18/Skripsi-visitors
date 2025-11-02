import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


async function isHoliday(dateStr: string): Promise<boolean> {
  // Accepts a date string or Date-parsable value and returns true for
  // a small set of Indonesian national holidays (fixed dates) and
  // Good Friday (calculated from Easter). This is intentionally
  // lightweight and offline; extend to call an external API if needed.
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  const year = d.getFullYear();
  const fmt = (dt: Date) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const iso = fmt(d);

  // Fixed-date national holidays (common ones)
  const fixed = new Set([
    `${year}-01-01`, // New Year's Day
    `${year}-05-01`, // Labour Day
    `${year}-06-01`, // Pancasila Day
    `${year}-08-17`, // Independence Day
    `${year}-12-25`, // Christmas
  ]);

  // Compute Easter Sunday (Meeus/Jones algorithm) and Good Friday
  const easterSunday = (y: number) => {
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d1 = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d1 - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Mar,4=Apr
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  };

  const es = easterSunday(year);
  const goodFriday = new Date(es);
  goodFriday.setDate(es.getDate() - 2);
  const gfIso = fmt(goodFriday);

  if (fixed.has(iso)) return true;
  if (iso === gfIso) return true;

  // Not a known holiday
  return false;
}

const detectDayType = async (date: string): Promise<"Weekday" | "Weekend"> => {
  const d = new Date(date);
  const day = d.getDay();
  if (day === 0 || day === 6) {
    return "Weekend";
  }
  const holiday = await isHoliday(date);
  if (holiday) {
    return "Weekend";
  }
  return "Weekday";
};


export const detectCategory = (nationality: string) => {
  return nationality.toLowerCase() === "indonesia" ? "Nusantara" : "Mancanegara";
};