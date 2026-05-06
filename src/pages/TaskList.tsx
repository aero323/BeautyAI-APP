import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, ClipboardList, MessageSquare, Timer } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";
import type { Mission } from "../data/mockData";
import { getMissionTagLabels } from "../lib/missionLabels";
import { sortMissionsForToday } from "../lib/missionSort";

export function TaskList() {
  const { user, missions } = useMockAuth();
  if (!user) return null;
  const sortedMissions = sortMissionsForToday(missions);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="px-6 py-6 pb-8 bg-white rounded-b-[48px] shadow-sm border-b border-pink-100">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-8">Tasks</h1>
        <p className="text-[13px] text-gray-500 font-medium mt-1">{user.regionName} assigned task inbox</p>
      </div>

      <div className="px-6 py-6 space-y-3">
        {sortedMissions.map(mission => <TaskRow key={mission.id} mission={mission} />)}
      </div>
    </div>
  );
}

function TaskRow({ mission }: { key?: number; mission: Mission }) {
  const isDone = mission.status === "done";
  const typeLabel = mission.type === "course" ? "学习任务" : mission.type === "practice" ? "练习任务" : "考试任务";
  const icon = mission.type === "course" ? <BookOpen size={20} /> : mission.type === "practice" ? <MessageSquare size={20} /> : <ClipboardList size={20} />;
  const progressPercent = Math.min(100, Math.round((mission.progressCurrent / mission.progressTarget) * 100));
  const tagLabels = getMissionTagLabels(mission);

  return (
    <Link to={mission.route} className={`block rounded-[24px] p-5 shadow-sm border ${isDone ? "bg-green-50/60 border-green-100" : "bg-white border-pink-100"}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDone ? "bg-green-100 text-green-600" : "bg-rose-50 text-rose-500"}`}>
          {isDone ? <CheckCircle2 size={22} /> : icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{typeLabel}</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDone ? "bg-green-100 text-green-600" : "bg-rose-50 text-rose-500"}`}>
              {isDone ? "Done" : mission.status === "in_progress" ? "In Progress" : "To Do"}
            </span>
          </div>
          <h3 className="font-black text-gray-800 text-sm mt-1">{mission.title}</h3>
          {tagLabels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tagLabels.map(label => (
                <span key={label} className="text-[9px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-full">{label}</span>
              ))}
            </div>
          )}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] font-bold mb-1.5">
              <span className="text-gray-400 flex items-center gap-1"><Timer size={11} />{mission.dueText}</span>
              <span className={isDone ? "text-green-600" : "text-rose-500"}>{mission.progressCurrent}/{mission.progressTarget}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${isDone ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-rose-400"}`} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
