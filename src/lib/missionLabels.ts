import type { Mission } from "../data/mockData";

export function getMissionTagLabels(mission: Mission) {
  if (mission.type === "collection") {
    return [mission.sourceLabel === "总部" ? "总部" : mission.sourceLabel, mission.collectionTask?.mediaType === "video" ? "视频采集" : "音频采集"];
  }
  if (mission.type === "practice") {
    return [getSourceLabel(mission), getFrequencyLabel(mission)];
  }

  if (mission.type === "exam") {
    return [];
  }

  return [getSourceLabel(mission)];
}

function getSourceLabel(mission: Mission) {
  return mission.sourceLabel === "总部" ? "总部" : "区域";
}

function getFrequencyLabel(mission: Mission) {
  const target = mission.progressTarget;
  if (mission.cycleLabel.includes("日") || mission.cycleLabel.includes("今日")) {
    return `每日${target}次`;
  }

  if (mission.cycleLabel.includes("周")) {
    return `每周${target}次`;
  }

  return `${mission.cycleLabel}${target}次`;
}
