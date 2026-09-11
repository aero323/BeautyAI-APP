import { Link, useParams } from "react-router-dom";
import { AlertTriangle, BookOpen, Check, CheckCircle2, Circle, ClipboardCheck, LockKeyhole, MessagesSquare, RotateCcw, Sparkles } from "lucide-react";
import { PageHeader, Pill, ProgressBar } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import { trainingPlans } from "../cargo/data";

export function CargoPlanDetail() {
  const { id } = useParams();
  const { completedStages, examAttempts } = useCargo();
  const plan = trainingPlans.find(item => item.id === id) ?? trainingPlans[0];
  const attempts = examAttempts["pda-scan"] ?? 0;
  const passed = attempts >= 2;
  const courseDone = completedStages.includes(`${plan.id}:course`);
  const practiceDone = completedStages.includes(`${plan.id}:practice`);
  const retrainDone = completedStages.includes(`${plan.id}:retrain`);
  const progress = passed ? 100 : practiceDone ? 72 : courseDone ? 55 : 40;

  const statusFor = (stageId: string) => {
    if (stageId === "event") return "done";
    if (stageId === "course") return courseDone ? "done" : "active";
    if (stageId === "practice") return practiceDone ? "done" : courseDone ? "active" : "locked";
    if (stageId === "exam") {
      if (passed) return "done";
      if (!practiceDone) return "locked";
      if (attempts === 1 && !retrainDone) return "failed";
      return "active";
    }
    if (stageId === "retrain") return attempts === 0 ? "hidden" : retrainDone || passed ? "done" : "active";
    if (stageId === "complete") return passed ? "done" : "locked";
    return "locked";
  };

  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="培训计划" subtitle="自动触发 · 个人专项" />
      <div className="page-x py-5">
        <div className="rounded-[28px] bg-gray-950 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between"><Pill tone={passed ? "green" : "red"}>{passed ? "已完成" : "业务事件触发"}</Pill><span className="text-2xl font-black text-red-400">{progress}%</span></div>
          <h1 className="mt-4 text-xl font-black">{plan.title}</h1>
          <p className="mt-2 text-xs leading-5 text-gray-300">{plan.reason}</p>
          <div className="mt-4"><ProgressBar value={progress} color="bg-primary" /></div>
          <div className="mt-3 flex items-center justify-between text-[10px]"><span className="text-amber-300">{plan.dueText}</span><span className="text-gray-400">通过线 80 分</span></div>
        </div>

        {attempts === 1 && !passed && <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-amber-200 bg-amber-50 p-4"><AlertTriangle size={20} className="mt-0.5 flex-none text-amber-600" /><div><h3 className="text-sm font-black text-amber-900">首次考试未通过</h3><p className="mt-1 text-xs leading-5 text-amber-700">得分 68，系统已追加易错点补训。完成后可再次考试。</p></div></div>}

        <div className="relative mt-5 space-y-3 before:absolute before:bottom-7 before:left-[25px] before:top-7 before:w-px before:bg-gray-200">
          {plan.stages.map(stage => {
            const status = statusFor(stage.id);
            if (status === "hidden") return null;
            const canOpen = status === "active" || status === "failed" || status === "done";
            return (
              <Link key={stage.id} to={canOpen && stage.route ? stage.route : "#"} onClick={event => { if (!canOpen || !stage.route) event.preventDefault(); }} className={`relative flex items-start gap-3 rounded-[22px] border bg-white p-4 shadow-sm ${status === "active" ? "border-red-200" : status === "failed" ? "border-amber-200" : "border-gray-100"}`}>
                <span className={`z-10 flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${status === "done" ? "bg-green-50 text-green-600" : status === "active" ? "bg-red-50 text-primary" : status === "failed" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-400"}`}><StageIcon id={stage.id} status={status} /></span>
                <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><strong className="text-sm text-gray-900">{stage.title}</strong><Pill tone={status === "done" ? "green" : status === "failed" ? "amber" : status === "active" ? "red" : "gray"}>{status === "done" ? "已完成" : status === "failed" ? "未通过" : status === "active" ? "进行中" : "未解锁"}</Pill></span><span className="mt-1.5 block text-[11px] leading-5 text-gray-500">{stage.description}</span>{stage.id === "exam" && attempts > 0 && <span className="mt-2 block text-[10px] font-bold text-amber-600">已考试 {attempts} 次 · 最近得分 {passed ? 92 : 68}</span>}</span>
              </Link>
            );
          })}
        </div>

        {passed && <div className="mt-5 rounded-[26px] border border-green-200 bg-green-50 p-5 text-center"><CheckCircle2 size={32} className="mx-auto text-green-600" /><h3 className="mt-3 font-black text-green-900">专项提升计划已完成</h3><p className="mt-2 text-xs text-green-700">学习结果已模拟回传，120 积分已进入流水。</p></div>}
      </div>
    </div>
  );
}

function StageIcon({ id, status }: { id: string; status: string }) {
  if (status === "done") return <Check size={20} />;
  if (status === "locked") return <LockKeyhole size={19} />;
  if (status === "failed") return <RotateCcw size={19} />;
  if (id === "event") return <Sparkles size={19} />;
  if (id === "course" || id === "retrain") return <BookOpen size={19} />;
  if (id === "practice") return <MessagesSquare size={19} />;
  if (id === "exam") return <ClipboardCheck size={19} />;
  return <Circle size={19} />;
}
