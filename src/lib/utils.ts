import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    "Bahrain": "🇧🇭", "Saudi Arabia": "🇸🇦", "Australia": "🇦🇺",
    "Japan": "🇯🇵", "China": "🇨🇳", "United States": "🇺🇸",
    "Italy": "🇮🇹", "Monaco": "🇲🇨", "Spain": "🇪🇸",
    "Canada": "🇨🇦", "Austria": "🇦🇹", "United Kingdom": "🇬🇧",
    "Hungary": "🇭🇺", "Belgium": "🇧🇪", "Netherlands": "🇳🇱",
    "Azerbaijan": "🇦🇿", "Singapore": "🇸🇬", "Mexico": "🇲🇽",
    "Brazil": "🇧🇷", "Qatar": "🇶🇦", "United Arab Emirates": "🇦🇪",
  };
  return flags[country] || "🏁";
}

export function formatNationalityFlag(code: string): string {
  const flags: Record<string, string> = {
    "American": "🇺🇸",
    "Argentine": "🇦🇷",
    "Australian": "🇦🇺",
    "Brazilian": "🇧🇷",
    "British": "🇬🇧",
    "Canadian": "🇨🇦",
    "Chinese": "🇨🇳",
    "Danish": "🇩🇰",
    "Dutch": "🇳🇱",
    "Finnish": "🇫🇮",
    "French": "🇫🇷",
    "German": "🇩🇪",
    "Italian": "🇮🇹",
    "Japanese": "🇯🇵",
    "Mexican": "🇲🇽",
    "Monegasque": "🇲🇨",
    "New Zealander": "🇳🇿",
    "Spanish": "🇪🇸",
    "Thai": "🇹🇭",
    "NL": "🇳🇱", "NZ": "🇳🇿", "MC": "🇲🇨", "GB": "🇬🇧",
    "AU": "🇦🇺", "IT": "🇮🇹", "ES": "🇪🇸", "CA": "🇨🇦",
    "FR": "🇫🇷", "TH": "🇹🇭", "JP": "🇯🇵", "DE": "🇩🇪",
    "BR": "🇧🇷", "FI": "🇫🇮", "CN": "🇨🇳", "US": "🇺🇸",
    "DK": "🇩🇰", "MX": "🇲🇽", "AR": "🇦🇷",
  };

  const normalized = code.trim();
  return flags[normalized] || flags[normalized.toUpperCase()] || "🏁";
}
