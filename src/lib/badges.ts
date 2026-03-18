// Badge definitions for the TRGT F1 platform
export type BadgeId =
  | "perfect_podium"   // Predicted all 3 podium positions correctly
  | "pace_master"      // Predicted fastest lap correctly 3 times
  | "veteran"          // Made 10+ predictions
  | "first_blood"      // Submitted first prediction
  | "safety_psychic"   // Predicted safety car correctly 5 times
  | "retirement_prophet"; // Predicted first retirement correctly 3 times

export interface BadgeDefinition {
  id: BadgeId;
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  icon: string; // emoji or icon name
}

export const BADGES: BadgeDefinition[] = [
  {
    id: "perfect_podium",
    label: "Perfect Pod",
    description: "Predicted all 3 podium positions correctly in a single race.",
    color: "#FFD700",
    bg: "bg-[#FFD700]/10",
    border: "border-[#FFD700]",
    icon: "🏆",
  },
  {
    id: "pace_master",
    label: "Pace Master",
    description: "Correctly predicted the fastest lap driver 3 times.",
    color: "#9B59B6",
    bg: "bg-purple-500/10",
    border: "border-purple-500",
    icon: "⚡",
  },
  {
    id: "veteran",
    label: "Veteran",
    description: "Submitted predictions for 10 or more races.",
    color: "#EE3F2C",
    bg: "bg-trgt-crimson/10",
    border: "border-trgt-crimson",
    icon: "🎖",
  },
  {
    id: "first_blood",
    label: "First Blood",
    description: "Submitted your very first prediction.",
    color: "#27F4D2",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400",
    icon: "🔓",
  },
  {
    id: "safety_psychic",
    label: "SC Psychic",
    description: "Correctly predicted the safety car outcome 5 times.",
    color: "#FFD700",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400",
    icon: "🚘",
  },
  {
    id: "retirement_prophet",
    label: "DNF Prophet",
    description: "Correctly predicted the first retirement 3 times.",
    color: "#EE3F2C",
    bg: "bg-trgt-crimson/10",
    border: "border-trgt-crimson",
    icon: "💀",
  },
];

interface BadgePrediction {
  pointsEarned?: number | null;
  accuracyScore?: number | null;
  fastestLap?: string | null;
}

export function computeBadges(predictions: BadgePrediction[]): BadgeId[] {
  const earned: BadgeId[] = [];

  if (predictions.length >= 1) earned.push("first_blood");
  if (predictions.length >= 10) earned.push("veteran");
  
  const fastestLapHits = predictions.filter(
    (p) => p.pointsEarned && p.accuracyScore && p.accuracyScore > 0 && p.fastestLap
  ).length;
  if (fastestLapHits >= 3) earned.push("pace_master");

  return earned;
}
