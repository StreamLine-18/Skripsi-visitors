// Date formatting utilities

/**
 * Format date to Indonesian long format
 * Example: "Senin, 20 November 2025"
 */
export const formatDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return "Tanggal tidak diketahui";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Tanggal tidak valid";
  
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format date to short format
 * Example: "20 Nov 2025"
 */
export const formatDateShort = (date: Date | string | number | null | undefined): string => {
  if (!date) return "-";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format date with time
 * Example: "Senin, 20 November 2025, 14:30"
 */
export const formatDateTime = (date: Date | string | number | null | undefined): string => {
  if (!date) return "-";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  
  return d.toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format time only
 * Example: "14:30"
 */
export const formatTime = (date: Date | string | number | null | undefined): string => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date without weekday
 * Example: "20 November 2025"
 */
export const formatDateNoWeekday = (date: Date | string | number | null | undefined): string => {
  if (!date) return "Tanggal tidak diketahui";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Tanggal tidak valid";
  
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format date with full time details
 * Example: "20 November 2025, 14:30:45"
 */
export const formatDateTimeFull = (date: Date | string | number | null | undefined): string => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
