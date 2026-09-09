import { ArrowLeft, CheckCircle2, FileAudio, FileVideo, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";

export function CollectionTaskSuccess() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const { user, getMissionById, getCollectionSubmission } = useMockAuth();
  const mission = getMissionById(Number(missionId));
  const task = mission?.collectionTask;
  const submission = mission ? getCollectionSubmission(mission.id) : null;
  if (!user || !mission || !task || !submission) return <div className="p-6 text-sm text-gray-500">提交记录不存在。</div>;
  return <div className="min-h-full bg-background pb-8">
    <header className="flex items-center gap-3 border-b border-pink-100 bg-white px-6 pb-4 pt-10"><button type="button" onClick={() => navigate("/tasks")} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-2xl text-gray-500 hover:bg-pink-50"><ArrowLeft size={21} /></button><div><h1 className="text-xl font-black text-gray-900">采集成功</h1><p className="text-[11px] text-gray-400">优秀案例采集 · {mission.sourceLabel}</p></div></header>
    <div className="space-y-5 px-6 py-6">
      <section className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-6 text-center shadow-sm"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={34} /></span><h2 className="mt-4 text-2xl font-black text-emerald-900">太棒了，{user.greetingName}！</h2><p className="mt-2 text-sm leading-6 text-emerald-800/80">你的优秀案例已经成功提交，感谢你为品牌留下这份真实经验。</p><span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-emerald-700"><Sparkles size={14} />任务已完成</span></section>
      <section className="rounded-[26px] border border-pink-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-rose-500">{task.mediaType === "video" ? <FileVideo size={20} /> : <FileAudio size={20} />}</span><div className="min-w-0 flex-1"><p className="text-sm font-black text-gray-900">{task.targetTitle}</p><p className="mt-1 text-[11px] text-gray-400">{task.mediaType === "video" ? "视频采集" : "音频采集"} · {submission.name}</p></div></div>{task.mediaType === "video" ? <video src={submission.url} controls className="mt-4 aspect-video w-full rounded-2xl bg-black object-cover" /> : <audio src={submission.url} controls className="mt-4 w-full" />}<div className="mt-3 flex justify-between text-[10px] text-gray-400"><span>提交时间</span><span>{new Date(submission.submittedAt).toLocaleString("zh-CN")}</span></div></section>
      <button type="button" onClick={() => { if (window.confirm("重新采集后，新文件提交成功会替换当前文件。确定继续吗？")) navigate(`/tasks/collection/${mission.id}`); }} className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-white text-xs font-black text-rose-600"><RotateCcw size={15} />重新采集</button>
      <button type="button" onClick={() => navigate("/beauty")} className="flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-sm font-black text-white shadow-lg shadow-rose-200">返回首页</button>
    </div>
  </div>;
}
