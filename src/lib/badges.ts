export type BadgeId =
  | "paddock_pass"
  | "lights_out"
  | "formation_lap"
  | "grid_regular"
  | "points_hunter"
  | "apex_reader"
  | "pit_wall_mind";

type BadgeMetric = "account" | "predictions" | "points" | "accuracy";

export interface BadgeDefinition {
  id: BadgeId;
  label: string;
  description: string;
  color: string;
  icon: string;
  metric: BadgeMetric;
  target: number;
}

export interface BadgeProgressInput {
  accountCreatedAt: Date | string | null;
  predictionsCount: number;
  totalPoints: number;
  accuracy: number;
}

export interface StoredBadgeRecord {
  badgeType: string;
  earnedAt: Date | string;
}

export interface BadgeState extends BadgeDefinition {
  unlocked: boolean;
  earnedAt: string | null;
  currentValue: number;
  progressPercent: number;
  progressText: string;
  statusText: string;
  remainingText: string | null;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: "paddock_pass",
    label: "Paddock Pass",
    description: "Created your TRGT account and entered the garage.",
    color: "#27F4D2",
    icon: "🪪",
    metric: "account",
    target: 1,
  },
  {
    id: "lights_out",
    label: "Lights Out",
    description: "Locked in your first race prediction.",
    color: "#EE3F2C",
    icon: "🚥",
    metric: "predictions",
    target: 1,
  },
  {
    id: "formation_lap",
    label: "Formation Lap",
    description: "Completed predictions for 3 race weekends.",
    color: "#F59E0B",
    icon: "🏎",
    metric: "predictions",
    target: 3,
  },
  {
    id: "grid_regular",
    label: "Grid Regular",
    description: "Stayed on the wall for 10 race weekends.",
    color: "#3B82F6",
    icon: "📡",
    metric: "predictions",
    target: 10,
  },
  {
    id: "points_hunter",
    label: "Points Hunter",
    description: "Banked 25 season points from scored predictions.",
    color: "#10B981",
    icon: "🎯",
    metric: "points",
    target: 25,
  },
  {
    id: "apex_reader",
    label: "Apex Reader",
    description: "Reached 60% average prediction accuracy.",
    color: "#8B5CF6",
    icon: "📈",
    metric: "accuracy",
    target: 60,
  },
  {
    id: "pit_wall_mind",
    label: "Pit Wall Mind",
    description: "Reached 75% average prediction accuracy.",
    color: "#EC4899",
    icon: "🧠",
    metric: "accuracy",
    target: 75,
  },
];

function formatBadgeDate(value: Date | string | null): string {
  if (!value) {
    return "recently";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getCurrentValue(badge: BadgeDefinition, input: BadgeProgressInput): number {
  switch (badge.metric) {
    case "account":
      return input.accountCreatedAt ? 1 : 0;
    case "predictions":
      return input.predictionsCount;
    case "points":
      return input.totalPoints;
    case "accuracy":
      return input.accuracy;
  }
}

function getProgressText(badge: BadgeDefinition, currentValue: number): string {
  if (badge.metric === "accuracy") {
    return `${Math.max(0, currentValue)}% / ${badge.target}%`;
  }

  return `${Math.max(0, currentValue)} / ${badge.target}`;
}

function getRemainingText(badge: BadgeDefinition, remaining: number): string | null {
  if (remaining <= 0) {
    return null;
  }

  switch (badge.metric) {
    case "account":
      return "Create your account to unlock";
    case "predictions":
      return `${remaining} more prediction${remaining === 1 ? "" : "s"} to unlock`;
    case "points":
      return `${remaining} more point${remaining === 1 ? "" : "s"} to unlock`;
    case "accuracy":
      return `${remaining}% more accuracy to unlock`;
  }
}

export function buildBadgeStates(
  input: BadgeProgressInput,
  storedBadges: StoredBadgeRecord[]
): BadgeState[] {
  const storedBadgeMap = new Map(
    storedBadges.map((badge) => [
      badge.badgeType,
      badge.earnedAt instanceof Date ? badge.earnedAt.toISOString() : new Date(badge.earnedAt).toISOString(),
    ])
  );

  return BADGES.map((badge) => {
    const currentValue = getCurrentValue(badge, input);
    const unlocked = storedBadgeMap.has(badge.id) || currentValue >= badge.target;
    const remaining = Math.max(badge.target - currentValue, 0);
    const earnedAt =
      storedBadgeMap.get(badge.id) ??
      (badge.id === "paddock_pass" && input.accountCreatedAt
        ? new Date(input.accountCreatedAt).toISOString()
        : null);

    return {
      ...badge,
      unlocked,
      earnedAt,
      currentValue,
      progressPercent: Math.max(0, Math.min(100, Math.round((currentValue / badge.target) * 100))),
      progressText: getProgressText(badge, currentValue),
      statusText: unlocked
        ? `Unlocked ${formatBadgeDate(earnedAt)}`
        : getRemainingText(badge, remaining) ?? "Locked",
      remainingText: getRemainingText(badge, remaining),
    };
  });
}
