import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, ClipboardCheck, Clock3, History, LockKeyhole, RotateCcw } from "lucide-react";
import { Pill, SectionTitle } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";

export function CargoExamHub() {
  const { completedStages, examAttempts } = useCargo();
  const practiceDone = completedStages.includes("plan-pda-001:practice");
  const retrainDone = completedStages.includes("plan-pda-001:retrain");
  const attempts = examAttempts["pda-scan"] ?? 0;
  const passed = attempts >= 2;
  const canStart = attempts === 0 ? practiceDone : retrainDone || passed;
  const status = passed ? "已通过" : attempts === 1 ? "待补训" : canStart ? "待考试" : "未解锁";

  return (
    <div className="min-h-full bg-background">
      <header className="bg-white px-5 pb-5 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Examination</p>
        <h1 className="mt-1 text-2xl font-black text-gray-950">考试</h1>
        <p className="mt-2 text-xs leading-5 text-gray-500">查看专项考试、历史成绩和重考状态。</p>
      </header>

      <div className="page-x space-y-6 py-5">
        <section>
          <SectionTitle title="待完成考试" />
          <Link to={canStart ? "/exam/pda-scan" : "/plans/plan-pda-001"} className="tap card block p-5">
            <div className="flex items-start gap-3">
              <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${passed ? "bg-green-50 text-green-600" : attempts === 1 ? "bg-amber-50 text-amber-600" : canStart ? "bg-red-50 text-primary" : "bg-gray-100 text-gray-400"}`}>
                {passed ? <CheckCircle2 size={22} /> : attempts === 1 ? <RotateCcw size={21} /> : canStart ? <ClipboardCheck size={22} /> : <LockKeyhole size={20} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2"><Pill tone={passed ? "green" : attempts === 1 ? "amber" : canStart ? "red" : "gray"}>{status}</Pill><span className="text-[10px] text-gray-400">80 分通过</span></span>
                <strong className="mt-2 block text-sm text-gray-900">PDA 扫描异常专项考试</strong>
                <span className="mt-1.5 block text-[11px] leading-5 text-gray-500">填空、图片、视频和分支场景题，共 4 题。</span>
                <span className="mt-3 flex items-center justify-between text-[10px] font-bold text-gray-400"><span className="flex items-center gap-1"><Clock3 size={12} />10 分钟</span><span>{attempts > 0 ? `已考 ${attempts} 次` : canStart ? "今天 20:00 前" : "完成场景模拟后解锁"}</span></span>
              </span>
              <ChevronRight size={18} className="mt-1 text-gray-300" />
            </div>
          </Link>
        </section>

        <section>
          <SectionTitle title="历史考试" />
          <div className="card flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-green-50 text-green-600"><History size={20} /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm text-gray-900">违规退件风险测验</strong><span className="mt-1 block text-[11px] text-gray-500">7月26日 · 首次通过</span></span>
            <span className="text-lg font-black text-green-600">88</span>
          </div>
        </section>
      </div>
    </div>
  );
}
