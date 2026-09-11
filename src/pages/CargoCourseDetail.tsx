import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3, FileText } from "lucide-react";
import { PageHeader } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import { cargoCourses } from "../cargo/data";

export function CargoCourseDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { completeStage, completedStages } = useCargo();
  const course = cargoCourses.find(item => item.id === id) ?? cargoCourses[0];
  const isRetrain = params.get("retrain") === "1";
  const stageKey = isRetrain ? "plan-pda-001:retrain" : "plan-pda-001:course";
  const completed = completedStages.includes(stageKey);
  const finish = () => { completeStage(stageKey); navigate("/plans/plan-pda-001"); };

  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title={course.title} subtitle={isRetrain ? "补训课程 · 易错点复习" : `专项课程 · ${course.duration}`} />
      <div className="page-x py-5">
        <div className="card p-5">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-primary"><FileText size={20} /></span><div><h3 className="font-black">课程说明</h3><p className="mt-1 text-[10px] text-gray-400">来源：PDA扫描异常处理 SOP V3.2</p></div></div>
          <p className="mt-4 text-xs leading-6 text-gray-600">{course.description} 完成后将解锁场景模拟。</p>
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-gray-50 p-3 text-[11px] text-gray-500"><span className="flex items-center gap-1"><Clock3 size={13} />{course.duration}</span><span>3 个知识节点</span><span>完成得 20 分</span></div>
        </div>

        <button onClick={finish} className="tap mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black text-white">{completed ? <CheckCircle2 size={18} /> : null}{completed ? "已完成，返回计划" : isRetrain ? "完成补训并解锁重考" : "完成课程并解锁场景模拟"}</button>
      </div>
    </div>
  );
}
