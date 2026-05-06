import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, FileText, MessageSquare, Mic } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";
import { getPracticeUnitId } from "../data/mockData";
import { getMissionTagLabels } from "../lib/missionLabels";

export function PracticeTaskDetail() {
  const { missionId } = useParams();
  const { user, regionData, getMissionById, getNextPracticeRoute } = useMockAuth();
  if (!user || !regionData) return null;

  const mission = getMissionById(Number(missionId));
  if (!mission?.practiceTask) {
    return <Navigate to="/" replace />;
  }

  const completed = new Set(mission.completedUnitIds ?? []);
  const nextRoute = getNextPracticeRoute(mission.id) ?? "/practice";
  const countPercent = Math.min(100, Math.round((mission.progressCurrent / mission.progressTarget) * 100));
  const coveragePercent = mission.coverageTarget ? Math.min(100, Math.round(((mission.coverageCurrent ?? 0) / mission.coverageTarget) * 100)) : 0;
  const tagLabels = getMissionTagLabels(mission);
  const coverageLabel = mission.coverageTarget ? `已完成 ${mission.coverageCurrent ?? 0}/${mission.coverageTarget} 个指定练习资产` : null;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="px-6 py-6 pb-8 bg-white rounded-b-[48px] shadow-sm border-b border-pink-100">
        <Link to="/" className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 mt-8">
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400">Practice Task</p>
          <h1 className="mt-2 text-2xl font-black text-gray-800 tracking-tight">{mission.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {tagLabels.map((label, index) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${index === 0 ? "bg-rose-50 text-rose-500" : "bg-gray-100 text-gray-500"}`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-[28px] border border-pink-100 bg-rose-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1 text-gray-500"><Clock size={13} />{mission.dueText}</span>
              <span className="text-rose-500">频次 {mission.progressCurrent}/{mission.progressTarget}</span>
            </div>
            <div className="h-2 rounded-full bg-white overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400" style={{ width: `${countPercent}%` }} />
            </div>
            {(mission.coverageTarget ?? 0) > 0 && (
              <>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-500">指定练习资产</span>
                  <span className="text-indigo-500">{coverageLabel}</span>
                </div>
                <div className="h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${coveragePercent}%` }} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        <Link
          to={nextRoute}
          className="flex items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-pink-500 to-rose-400 py-4 text-sm font-black text-white shadow-lg shadow-rose-200"
        >
          <MessageSquare size={16} />
          Continue Practice
        </Link>

        <UnitGroup
          title="数字人顾客"
          items={mission.practiceTask.personaIds.map(id => {
            const persona = regionData.personas.find(item => item.id === id);
            if (!persona) return null;
            return {
              id,
              title: persona.name,
              subtitle: persona.focus,
              icon: <MessageSquare size={18} />,
              route: `/practice/chat/${id}?missionId=${mission.id}`,
              done: completed.has(getPracticeUnitId("persona", id))
            };
          })}
        />

        <UnitGroup
          title="场景剧本"
          items={mission.practiceTask.scenarioIds.map(id => {
            const scenario = regionData.scenarios.find(item => item.id === id);
            if (!scenario) return null;
            return {
              id,
              title: scenario.title,
              subtitle: scenario.hintKeywords,
              icon: <FileText size={18} />,
              route: `/script/${id}?hint=true&missionId=${mission.id}`,
              done: completed.has(getPracticeUnitId("scenario", id))
            };
          })}
        />

        <UnitGroup
          title="金句跟读"
          items={mission.practiceTask.sentenceIds.map(id => {
            const sentence = regionData.sentences.find(item => item.id === id);
            if (!sentence) return null;
            return {
              id,
              title: sentence.title,
              subtitle: sentence.zh,
              icon: <Mic size={18} />,
              route: `/reading?missionId=${mission.id}&sentenceId=${id}`,
              done: completed.has(getPracticeUnitId("sentence", id))
            };
          })}
        />
      </div>
    </div>
  );
}

function UnitGroup({
  title,
  items
}: {
  title: string;
  items: Array<{ id: number; title: string; subtitle: string; icon: ReactNode; route: string; done: boolean } | null>;
}) {
  const visibleItems = items.filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (visibleItems.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-black text-gray-800">{title}</h2>
      <div className="space-y-3">
        {visibleItems.map(item => (
          <Link
            key={`${title}-${item.id}`}
            to={item.route}
            className={`flex items-start gap-4 rounded-[26px] border p-4 shadow-sm ${item.done ? "border-green-100 bg-green-50/60" : "border-pink-100 bg-white"}`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.done ? "bg-green-100 text-green-600" : "bg-rose-50 text-rose-500"}`}>
              {item.done ? <CheckCircle2 size={20} /> : item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-black text-gray-800">{item.title}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.done ? "bg-green-100 text-green-600" : "bg-rose-50 text-rose-500"}`}>
                  {item.done ? "已覆盖" : "去练习"}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-gray-500">{item.subtitle}</p>
            </div>
            <ChevronRight size={18} className="mt-1 text-gray-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
