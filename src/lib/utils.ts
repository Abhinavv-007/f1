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
    "NL": "🇳🇱", "NZ": "🇳🇿", "MC": "🇲🇨", "GB": "🇬🇧",
    "AU": "🇦🇺", "IT": "🇮🇹", "ES": "🇪🇸", "CA": "🇨🇦",
    "FR": "🇫🇷", "TH": "🇹🇭", "JP": "🇯🇵", "DE": "🇩🇪",
    "BR": "🇧🇷", "FI": "🇫🇮", "CN": "🇨🇳", "US": "🇺🇸",
    "DK": "🇩🇰", "MX": "🇲🇽",
  };
  return flags[code] || "🏁";
}
