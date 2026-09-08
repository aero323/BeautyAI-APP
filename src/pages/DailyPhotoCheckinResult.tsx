import { Check, CheckCircle2, Home, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";
import { readCheckinReport } from "../lib/photoCheckin";

// Fixed demo evaluations; no image analysis or remote upload is performed.
const evaluations = [
  {
    title: "妆容照", score: 94, label: "妆容得体",
    metrics: [{ label: "妆面整洁", score: 96 }, { label: "妆容协调", score: 94 }, { label: "仪容规范", score: 92 }],
    feedback: "整体妆面清爽，眉眼与唇色协调，符合门店接待形象。",
    suggestion: "拍摄时保持光线均匀，让底妆和眼妆细节更清晰。"
  },
  {
    title: "柜台出样照", score: 91, label: "陈列规范",
    metrics: [{ label: "陈列完整", score: 94 }, { label: "台面整洁", score: 92 }, { label: "产品朝向", score: 87 }],
    feedback: "主要产品陈列完整，台面整洁，重点产品展示清晰。",
    suggestion: "将试用品标签统一朝向顾客，并留出整齐的产品间距。"
  }
];

export function DailyPhotoCheckinResult() {
  const { user } = useMockAuth();
  const navigate = useNavigate();
  const [report] = useState(() => user ? readCheckinReport(user.id) : null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!report) return <Navigate to="/daily-checkin" replace />;

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-pink-100 bg-white px-6 pb-4 pt-10">
        <h1 className="text-xl font-black tracking-tight text-gray-900">打卡结果</h1>
        <p className="mt-1 text-[11px] text-gray-400">{report.date} · BA 门店日常</p>
      </header>
      <div className="space-y-5 px-6 py-5">
        <section className="rounded-[26px] border border-emerald-100 bg-white p-6 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"><CheckCircle2 size={32} /></span>
          <h2 className="mt-3 text-2xl font-black text-gray-900">打卡成功</h2>
          <p className="mt-2 text-xs leading-5 text-gray-500">今日两张照片已提交，AI 评分已完成</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700"><Check size={13} /> 今日打卡已完成</span>
        </section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-black text-gray-900"><Sparkles size={17} className="text-violet-500" /> AI 照片评分</h2>
          <span className="text-[10px] text-gray-400">满分 100 分 · 示例评分</span>
        </div>
        {evaluations.map((evaluation, index) => (
          <section key={evaluation.title} className="rounded-[24px] border border-pink-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={report.photos[index].url} alt={`已提交的${evaluation.title}`} className="h-24 w-20 flex-none rounded-2xl bg-pink-50 object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-gray-900">{evaluation.title}</h3>
                <p className="mt-1"><strong className="text-4xl font-black tracking-tight text-rose-500">{evaluation.score}</strong><span className="ml-1 text-xs text-gray-400">/ 100</span></p>
                <p className="mt-1 text-[11px] font-bold text-violet-600">{evaluation.label}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {evaluation.metrics.map(metric => (
                <div key={metric.label} className="flex items-center gap-3 text-[11px]">
                  <span className="w-14 flex-none text-gray-500">{metric.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-pink-50"><div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400" style={{ width: `${metric.score}%` }} /></div>
                  <span className="w-5 text-right font-bold text-gray-700">{metric.score}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-600">{evaluation.feedback}</p>
            <div className="mt-3 rounded-2xl bg-violet-50/70 p-3">
              <p className="text-[11px] font-bold text-violet-700">提升建议</p>
              <p className="mt-1 text-[11px] leading-5 text-gray-500">{evaluation.suggestion}</p>
            </div>
          </section>
        ))}
      </div>
      <footer className="sticky bottom-0 border-t border-pink-100 bg-background/95 px-6 pb-6 pt-4 backdrop-blur-xl">
        <button type="button" onClick={() => { navigate("/", { replace: true }); window.scrollTo(0, 0); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-sm font-black text-white shadow-lg shadow-rose-200 transition-colors hover:from-pink-600 hover:to-rose-500">
          <Home size={17} /> 完成并返回首页
        </button>
      </footer>
    </div>
  );
}
