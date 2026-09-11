import type { Mission } from "../data/mockData";

const typePriority: Record<Mission["type"], number> = {
  exam: 0,
  collection: 1,
  course: 2,
  practice: 3
};

export function sortMissionsForToday(missions: Mission[]) {
  return [...missions].sort((a, b) => {
    const typeDelta = typePriority[a.type] - typePriority[b.type];
    if (typeDelta !== 0) return typeDelta;

    const doneDelta = Number(a.status === "done") - Number(b.status === "done");
    if (doneDelta !== 0) return doneDelta;

    if (a.status !== "done" && b.status !== "done") {
      const dueDelta = getDueRank(a.dueText) - getDueRank(b.dueText);
      if (dueDelta !== 0) return dueDelta;
    }

    return a.id - b.id;
  });
}

function getDueRank(dueText: string) {
  const text = dueText.toLowerCase();
  const hoursMatch = text.match(/(\d+(?:\.\d+)?)h/);
  if (hoursMatch) return Number(hoursMatch[1]);

  if (text.includes("ends in")) return 12;
  if (text.includes("due today") || text.includes("tonight")) return 24;
  if (text.includes("tomorrow")) return 48;
  if (text.includes("sunday")) return 96;
  return 999;
}
