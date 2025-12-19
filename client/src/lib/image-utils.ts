// Image URL utility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Get the server root without /api suffix
const getServerRoot = (): string => {
  if (!API_BASE_URL) return "";
  // Remove /api from the end if it exists
  return API_BASE_URL.replace(/\/api\/?$/, "");
};

export const getFullImageUrl = (relativePath: string): string => {
  if (!relativePath) {
    return "https://placehold.co/600x400/EEE/31343C?text=No+Image";
  }

  // If it's already a full URL, return as is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }

  const serverRoot = getServerRoot();
  if (!serverRoot) {
    return "https://placehold.co/600x400/EEE/31343C?text=No+Image";
  }

  // Ensure path starts with /
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  
  return `${serverRoot}${path}`;
};
