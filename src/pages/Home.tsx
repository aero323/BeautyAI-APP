import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, BookOpen, MessageSquare, Timer, ChevronRight } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";
import type { Mission } from "../data/mockData";
import { getMissionTagLabels } from "../lib/missionLabels";
import { sortMissionsForToday } from "../lib/missionSort";

export function Home() {
  const { user, regionData, missions } = useMockAuth();
  if (!user || !regionData) return null;
  const sortedMissions = sortMissionsForToday(missions);
  const avatarSrc = user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`;

  return (
    <div className="flex flex-col min-h-full bg-background pb-6">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-white rounded-b-[32px] shadow-sm border-b border-pink-100 relative z-10 pt-10">
        <div>
          <p className="text-gray-400 text-xs">Good Morning,</p>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">{user.name} ✨</h2>
          <p className="text-[10px] text-rose-500 font-bold mt-1">{user.regionName}</p>
        </div>
        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 relative overflow-hidden ring-4 ring-white shadow-sm">
           <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        
        {/* Quick AI Entry */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-5 text-white shadow-lg shadow-rose-200">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-sm">AI Knowledge Assistant</p>
            <span className="bg-white/20 px-2 py-1 rounded-full text-[10px] font-bold">Online</span>
          </div>
          <p className="text-xs opacity-90 mb-4 italic">{regionData.assistantPrompt}</p>
          <Link to="/qa" className="w-full bg-white text-rose-500 font-bold py-2.5 rounded-xl text-xs flex justify-center items-center">
            Start Chatting
          </Link>
        </div>

        {/* Task Inbox */}
        <section>
          <div className="mb-3">
            <h3 className="font-bold text-gray-800">Today's Tasks</h3>
          </div>
          <div className="space-y-3">
            {sortedMissions.map(mission => <TaskCard key={mission.id} mission={mission} />)}
          </div>
        </section>

      </div>
    </div>
  );
}

function TaskCard({ mission }: { key?: number; mission: Mission }) {
  const icon = mission.type === "course"
    ? <BookOpen size={20} />
    : mission.type === "practice"
      ? <MessageSquare size={20} />
      : <ClipboardList size={20} />;
  const typeLabel = mission.type === "course" ? "学习任务" : mission.type === "practice" ? "练习任务" : "考试任务";
  const isDone = mission.status === "done";
  const statusLabel = mission.status === "done" ? "Done" : mission.status === "in_progress" ? "In Progress" : mission.status === "overdue" ? "Overdue" : "To Do";
  const progressPercent = Math.min(100, Math.round((mission.progressCurrent / mission.progressTarget) * 100));
  const tagLabels = getMissionTagLabels(mission);

  return (
    <Link
      to={mission.route}
      className={`bg-white border rounded-[24px] p-4 flex items-start gap-4 shadow-sm transition-all ${
        isDone ? "border-green-100 bg-green-50/40" : "border-pink-100 hover:border-rose-200 hover:shadow-md"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
        mission.type === "course"
          ? isDone ? "bg-green-100 text-green-600" : "bg-indigo-50 text-indigo-500"
          : mission.type === "practice"
            ? isDone ? "bg-green-100 text-green-600" : "bg-pink-50 text-rose-500"
            : isDone ? "bg-green-100 text-green-600" : "bg-orange-50 text-orange-500"
      }`}>
        {isDone ? <CheckCircle2 size={22} /> : icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{typeLabel}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
            isDone ? "bg-green-100 text-green-600" : "bg-rose-50 text-rose-500"
          }`}>{statusLabel}</span>
        </div>
        <p className={`text-sm font-black leading-tight ${isDone ? "text-green-800" : "text-gray-800"}`}>{mission.title}</p>
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
      <ChevronRight size={18} className={isDone ? "text-green-400" : "text-gray-300"} />
    </Link>
  );
}
