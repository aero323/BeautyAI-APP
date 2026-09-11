import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  basePointEntries,
  cargoNotifications,
  cargoUsers,
  type CargoUser,
  type PointEntry
} from "./data";

type NotificationSettings = Record<"event" | "course" | "exam" | "retrain" | "push", boolean>;

interface PersistedCargoState {
  completedStages: string[];
  readNotifications: string[];
  examAttempts: Record<string, number>;
  settings: NotificationSettings;
}

interface ExamResult {
  attempt: number;
  score: number;
  passed: boolean;
}

interface CargoContextValue {
  user: CargoUser | null;
  completedStages: string[];
  readNotifications: string[];
  examAttempts: Record<string, number>;
  settings: NotificationSettings;
  points: PointEntry[];
  totalPoints: number;
  loginAs: (id: string) => void;
  logout: () => void;
  markNotificationRead: (id: string) => void;
  completeStage: (stageId: string) => void;
  submitExam: (examId: string) => ExamResult;
  toggleSetting: (key: keyof NotificationSettings) => void;
  resetDemo: () => void;
}

const defaultSettings: NotificationSettings = {
  event: true,
  course: true,
  exam: true,
  retrain: true,
  push: true
};

const CargoContext = createContext<CargoContextValue | null>(null);

function stateKey(userId: string) {
  return `jt-cargo.state.${userId}`;
}

function loadState(userId: string): PersistedCargoState {
  const saved = window.localStorage.getItem(stateKey(userId));
  if (saved) {
    try {
      return JSON.parse(saved) as PersistedCargoState;
    } catch {
      // Continue with a deterministic clean demo state.
    }
  }
  return {
    completedStages: [],
    readNotifications: [],
    examAttempts: {},
    settings: defaultSettings
  };
}

export function CargoProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CargoUser | null>(() => {
    const id = window.localStorage.getItem("jt-cargo.user");
    return cargoUsers.find(item => item.id === id) ?? null;
  });
  const [state, setState] = useState<PersistedCargoState>(() => user ? loadState(user.id) : loadState("guest"));

  const persist = (next: PersistedCargoState, targetUser = user) => {
    setState(next);
    if (targetUser) window.localStorage.setItem(stateKey(targetUser.id), JSON.stringify(next));
  };

  const loginAs = (id: string) => {
    const nextUser = cargoUsers.find(item => item.id === id);
    if (!nextUser) return;
    window.localStorage.setItem("jt-cargo.user", nextUser.id);
    setUser(nextUser);
    setState(loadState(nextUser.id));
  };

  const logout = () => {
    window.localStorage.removeItem("jt-cargo.user");
    setUser(null);
    setState(loadState("guest"));
  };

  const markNotificationRead = (id: string) => {
    if (state.readNotifications.includes(id)) return;
    persist({ ...state, readNotifications: [...state.readNotifications, id] });
  };

  const completeStage = (stageId: string) => {
    if (state.completedStages.includes(stageId)) return;
    persist({ ...state, completedStages: [...state.completedStages, stageId] });
  };

  const submitExam = (examId: string): ExamResult => {
    const attempt = (state.examAttempts[examId] ?? 0) + 1;
    const score = attempt === 1 ? 68 : 92;
    const passed = score >= 80;
    const completedStages = passed
      ? Array.from(new Set([...state.completedStages, "plan-pda-001:exam", "plan-pda-001:complete"]))
      : state.completedStages;
    persist({
      ...state,
      examAttempts: { ...state.examAttempts, [examId]: attempt },
      completedStages
    });
    return { attempt, score, passed };
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    persist({ ...state, settings: { ...state.settings, [key]: !state.settings[key] } });
  };

  const resetDemo = () => {
    if (!user) return;
    window.localStorage.removeItem(stateKey(user.id));
    setState(loadState(user.id));
  };

  const points = useMemo(() => {
    if ((state.examAttempts["pda-scan"] ?? 0) < 2) return basePointEntries;
    return [
      { id: "point-plan", title: "PDA 错扫专项提升计划", detail: "培训闭环完成", date: "今天", points: 120 },
      ...basePointEntries
    ];
  }, [state.examAttempts]);

  const totalPoints = 818 + points.reduce((sum, item) => sum + item.points, 0);

  const value: CargoContextValue = {
    user,
    completedStages: state.completedStages,
    readNotifications: state.readNotifications,
    examAttempts: state.examAttempts,
    settings: state.settings,
    points,
    totalPoints,
    loginAs,
    logout,
    markNotificationRead,
    completeStage,
    submitExam,
    toggleSetting,
    resetDemo
  };

  return <CargoContext.Provider value={value}>{children}</CargoContext.Provider>;
}

export function useCargo() {
  const value = useContext(CargoContext);
  if (!value) throw new Error("useCargo must be used inside CargoProvider");
  return value;
}

export function unreadNotificationCount(readIds: string[]) {
  return cargoNotifications.filter(item => !readIds.includes(item.id)).length;
}
