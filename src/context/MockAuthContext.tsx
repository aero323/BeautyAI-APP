import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  getMissionCoverageTarget,
  getMissionUnitIds,
  getRegionDataset,
  missionIncludesUnit,
  mockUsers,
  type Mission,
  type CollectionSubmission,
  type MissionUnitId,
  type MockUser,
  type RegionDataset
} from "../data/mockData";

type MissionStatus = Mission["status"];
type MissionType = Mission["type"];
type MissionProgressState = Record<string, { status?: MissionStatus; progressCurrent?: number; completedUnitIds?: MissionUnitId[] }>;
type CollectionSubmissionState = Record<string, CollectionSubmission>;

interface MockAuthContextValue {
  user: MockUser | null;
  regionData: RegionDataset | null;
  missions: Mission[];
  loginAs: (userId: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  logout: () => void;
  completeMission: (missionId: number) => void;
  completeMissionBySource: (type: MissionType, sourceId?: number) => void;
  recordCompletion: (type: MissionType, sourceId?: number, completedUnitId?: MissionUnitId) => void;
  getMissionById: (missionId: number) => Mission | undefined;
  getNextStudyUnit: (missionId: number) => number | undefined;
  getNextPracticeRoute: (missionId: number) => string | undefined;
  getCollectionSubmission: (missionId: number) => CollectionSubmission | null;
  submitCollection: (missionId: number, submission: CollectionSubmission) => void;
  replaceCollectionSubmission: (missionId: number, submission: CollectionSubmission) => void;
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const hydrateUser = useCallback((baseUser: MockUser | null): MockUser | null => {
    if (!baseUser) return null;
    const savedAvatarUrl = window.localStorage.getItem(`beautyai.avatarUrl.${baseUser.id}`);
    return savedAvatarUrl ? { ...baseUser, avatarUrl: savedAvatarUrl } : baseUser;
  }, []);

  const [user, setUser] = useState<MockUser | null>(() => {
    const savedUserId = window.localStorage.getItem("beautyai.mockUserId");
    return hydrateUser(mockUsers.find(item => item.id === savedUserId) ?? null);
  });
  const [missionProgress, setMissionProgress] = useState<MissionProgressState>(() => {
    const savedState = window.localStorage.getItem("beautyai.missionProgress");
    if (savedState) {
      try {
        return JSON.parse(savedState) as MissionProgressState;
      } catch {
        return {};
      }
    }
    const legacyState = window.localStorage.getItem("beautyai.missionStatus");
    if (!legacyState) return {};
    try {
      const legacy = JSON.parse(legacyState ?? "{}") as Record<string, MissionStatus>;
      return Object.fromEntries(Object.entries(legacy).map(([key, status]) => [key, { status }]));
    } catch {
      return {};
    }
  });
  const [collectionSubmissions, setCollectionSubmissions] = useState<CollectionSubmissionState>(() => {
    try { return JSON.parse(window.localStorage.getItem("beautyai.collectionSubmissions") ?? "{}") as CollectionSubmissionState; } catch { return {}; }
  });

  const regionData = useMemo(() => {
    return user ? getRegionDataset(user.regionId) : null;
  }, [user]);

  const missions = useMemo(() => {
    if (!user || !regionData) return [];
    return regionData.missions.map(mission => ({
      ...mission,
      status: getMergedMissionState(user.id, mission, missionProgress).status,
      progressCurrent: getMergedMissionState(user.id, mission, missionProgress).progressCurrent,
      completedUnitIds: getMergedMissionState(user.id, mission, missionProgress).completedUnitIds,
      coverageCurrent: getMergedMissionState(user.id, mission, missionProgress).coverageCurrent,
      coverageTarget: getMergedMissionState(user.id, mission, missionProgress).coverageTarget,
      ...(mission.type === "collection" && collectionSubmissions[getMissionKey(user.id, mission.id)] ? { status: "done" as MissionStatus, progressCurrent: 1 } : {})
    }));
  }, [collectionSubmissions, missionProgress, regionData, user]);

  const loginAs = useCallback((userId: string) => {
    const nextUser = mockUsers.find(item => item.id === userId);
    if (!nextUser) return;
    const nextUserState = hydrateUser(nextUser) ?? nextUser;
    window.localStorage.setItem("beautyai.mockUserId", nextUser.id);
    setUser(nextUserState);
  }, [hydrateUser]);

  const updateAvatar = useCallback((avatarUrl: string) => {
    if (!user) return;
    const nextUser = { ...user, avatarUrl };
    window.localStorage.setItem(`beautyai.avatarUrl.${user.id}`, avatarUrl);
    setUser(nextUser);
  }, [user]);

  const logout = useCallback(() => {
    window.localStorage.removeItem("beautyai.mockUserId");
    setUser(null);
  }, []);

  const updateMissionStatus = useCallback((missionId: number, status: MissionStatus) => {
    if (!user) return;
    setMissionProgress(prev => {
      const key = getMissionKey(user.id, missionId);
      if (prev[key]?.status === status) return prev;
      const next = { ...prev, [key]: { ...prev[key], status } };
      window.localStorage.setItem("beautyai.missionProgress", JSON.stringify(next));
      return next;
    });
  }, [user]);

  const completeMission = useCallback((missionId: number) => {
    if (!user) return;
    const mission = missions.find(item => item.id === missionId);
    setMissionProgress(prev => {
      const key = getMissionKey(user.id, missionId);
      const nextProgress = mission?.progressTarget ?? prev[key]?.progressCurrent ?? 1;
      const next = {
        ...prev,
        [key]: {
          status: "done" as MissionStatus,
          progressCurrent: nextProgress,
          completedUnitIds: mission ? getMissionUnitIds(mission) : prev[key]?.completedUnitIds
        }
      };
      window.localStorage.setItem("beautyai.missionProgress", JSON.stringify(next));
      return next;
    });
  }, [missions, user]);

  const completeMissionBySource = useCallback((type: MissionType, sourceId?: number) => {
    const mission = missions.find(item => item.type === type && (sourceId === undefined || item.sourceId === sourceId));
    if (!mission) return;
    completeMission(mission.id);
  }, [completeMission, missions]);

  const recordCompletion = useCallback((type: MissionType, sourceId?: number, completedUnitId?: MissionUnitId) => {
    if (!user) return;
    const matchedMissions = missions.filter(item => {
      if (item.type !== type || item.status === "done") return false;
      const matchesSource = sourceId === undefined || item.sourceId === sourceId || Boolean(item.allowSharedCredit);
      if (!matchesSource) return false;
      if (!completedUnitId) return true;
      return missionIncludesUnit(item, completedUnitId);
    });

    if (matchedMissions.length === 0) return;

    setMissionProgress(prev => {
      const next = { ...prev };
      for (const mission of matchedMissions) {
        const key = getMissionKey(user.id, mission.id);
        const current = next[key]?.progressCurrent ?? mission.progressCurrent;
        const progressCurrent = Math.min(mission.progressTarget, current + 1);
        const savedUnits = next[key]?.completedUnitIds ?? mission.completedUnitIds ?? [];
        const completedUnitIds = completedUnitId && missionIncludesUnit(mission, completedUnitId)
          ? Array.from(new Set([...savedUnits, completedUnitId]))
          : savedUnits;
        const coverageTarget = getMissionCoverageTarget(mission);
        const coverageCurrent = Math.min(coverageTarget, completedUnitIds.length);
        const meetsFrequency = progressCurrent >= mission.progressTarget;
        const meetsCoverage = coverageTarget === 0 || coverageCurrent >= coverageTarget;
        next[key] = {
          ...next[key],
          progressCurrent,
          completedUnitIds,
          status: meetsFrequency && meetsCoverage ? "done" : "in_progress"
        };
      }
      window.localStorage.setItem("beautyai.missionProgress", JSON.stringify(next));
      return next;
    });
  }, [missions, user]);

  const getMissionById = useCallback((missionId: number) => {
    return missions.find(item => item.id === missionId);
  }, [missions]);

  const getNextStudyUnit = useCallback((missionId: number) => {
    const mission = missions.find(item => item.id === missionId);
    if (!mission?.studyTask) return undefined;
    const completed = new Set(mission.completedUnitIds ?? []);
    const nextCourseId = mission.studyTask.courseIds.find(courseId => !completed.has(`course:${courseId}`));
    return nextCourseId ?? mission.studyTask.courseIds[0];
  }, [missions]);

  const getNextPracticeRoute = useCallback((missionId: number) => {
    const mission = missions.find(item => item.id === missionId);
    if (!mission?.practiceTask) return undefined;

    const completed = new Set(mission.completedUnitIds ?? []);
    const nextPersona = mission.practiceTask.personaIds.find(id => !completed.has(`persona:${id}`)) ?? mission.practiceTask.personaIds[0];
    if (nextPersona !== undefined) {
      return `/practice/chat/${nextPersona}?missionId=${missionId}`;
    }

    const nextScenario = mission.practiceTask.scenarioIds.find(id => !completed.has(`scenario:${id}`)) ?? mission.practiceTask.scenarioIds[0];
    if (nextScenario !== undefined) {
      return `/script/${nextScenario}?hint=true&missionId=${missionId}`;
    }

    const nextSentence = mission.practiceTask.sentenceIds.find(id => !completed.has(`sentence:${id}`)) ?? mission.practiceTask.sentenceIds[0];
    if (nextSentence !== undefined) {
      return `/reading?missionId=${missionId}&sentenceId=${nextSentence}`;
    }

    return "/practice";
  }, [missions]);

  const getCollectionSubmission = useCallback((missionId: number) => {
    if (!user) return null;
    return collectionSubmissions[getMissionKey(user.id, missionId)] ?? null;
  }, [collectionSubmissions, user]);

  const saveCollection = useCallback((missionId: number, submission: CollectionSubmission) => {
    if (!user) return;
    const key = getMissionKey(user.id, missionId);
    setCollectionSubmissions(prev => {
      const next = { ...prev, [key]: submission };
      window.localStorage.setItem("beautyai.collectionSubmissions", JSON.stringify(next));
      return next;
    });
    setMissionProgress(prev => {
      const next = { ...prev, [key]: { ...prev[key], status: "done" as MissionStatus, progressCurrent: 1 } };
      window.localStorage.setItem("beautyai.missionProgress", JSON.stringify(next));
      return next;
    });
  }, [user]);

  return (
    <MockAuthContext.Provider value={{ user, regionData, missions, loginAs, updateAvatar, logout, completeMission, completeMissionBySource, recordCompletion, getMissionById, getNextStudyUnit, getNextPracticeRoute, getCollectionSubmission, submitCollection: saveCollection, replaceCollectionSubmission: saveCollection }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return context;
}

function getMissionKey(userId: string, missionId: number) {
  return `${userId}:${missionId}`;
}

function getMergedMissionState(userId: string, mission: Mission, state: MissionProgressState) {
  const saved = state[getMissionKey(userId, mission.id)];
  const progressCurrent = saved?.progressCurrent ?? mission.progressCurrent;
  const completedUnitIds = saved?.completedUnitIds ?? mission.completedUnitIds ?? [];
  const coverageTarget = getMissionCoverageTarget(mission);
  const coverageCurrent = Math.min(coverageTarget, completedUnitIds.length);
  const meetsFrequency = progressCurrent >= mission.progressTarget;
  const meetsCoverage = coverageTarget === 0 || coverageCurrent >= coverageTarget;
  const status = saved?.status ?? (meetsFrequency && meetsCoverage ? "done" : progressCurrent > 0 || coverageCurrent > 0 ? "in_progress" : mission.status);
  return { status, progressCurrent, completedUnitIds, coverageCurrent, coverageTarget };
}
