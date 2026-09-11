import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Bot, CheckCircle2, ChevronRight, CircleAlert, ClipboardCheck, MessagesSquare, Timer } from "lucide-react";
import { useCargo } from "../cargo/CargoContext";
import { businessEvents, trainingPlans } from "../cargo/data";
import { ProgressBar, SectionTitle } from "../cargo/components";

type HomeTaskStatus = "todo" | "in_progress" | "done" | "locked" | "retrain";

interface HomeTask {
  id: string;
  type: "course" | "practice" | "exam";
  title: string;
  route: string;
  dueText: string;
  status: HomeTaskStatus;
  progressCurrent: number;
  progressTarget: number;
  tags: string[];
}

export function CargoHome() {
  const { user, completedStages, examAttempts } = useCargo();
  if (!user) return null;
  const courseDone = completedStages.includes("plan-pda-001:course");
  const practiceDone = completedStages.includes("plan-pda-001:practice");
  const passed = (examAttempts["pda-scan"] ?? 0) >= 2;
  const attempts = examAttempts["pda-scan"] ?? 0;
  const planProgress = passed ? 100 : practiceDone ? 72 : courseDone ? 55 : 40;
  const tasks: HomeTask[] = [
    {
      id: "course",
      type: "course",
      title: "PDA 错扫纠正专项课",
      route: "/course/course-scan-correction",
      dueText: "今天 20:00 前",
      status: courseDone ? "done" : "in_progress",
      progressCurrent: courseDone ? 1 : 0,
      progressTarget: 1,
      tags: ["业务事件触发", "PDA 错扫"]
    },
    {
      id: "practice",
      type: "practice",
      title: "场景模拟",
      route: "/practice/pda-scan",
      dueText: "课程完成后解锁",
      status: practiceDone ? "done" : courseDone ? "todo" : "locked",
      progressCurrent: practiceDone ? 1 : 0,
      progressTarget: 1,
      tags: ["PDA 错扫", "SOP 节点"]
    },
    {
      id: "exam",
      type: "exam",
      title: "PDA 扫描异常专项考试",
      route: "/exam/pda-scan",
      dueText: attempts === 1 ? "完成补训后重考" : "今天 20:00 前",
      status: passed ? "done" : attempts === 1 ? "retrain" : practiceDone ? "todo" : "locked",
      progressCurrent: passed ? 1 : 0,
      progressTarget: 1,
      tags: attempts === 1 ? ["首次 68 分", "待补训重考"] : ["80 分通过", "12 类题型"]
    }
  ];

  return (
    <div className="min-h-full bg-background pb-5">
      <header className="rounded-b-[34px] bg-gray-950 px-5 pb-8 pt-12 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-gray-400">早上好，{user.role}</p>
            <h1 className="mt-1 text-2xl font-black">{user.name}</h1>
            <p className="mt-1 truncate text-[10px] text-gray-400">{user.station}</p>
          </div>
          <Link to="/profile" className="tap flex-none rounded-[22px] border border-white/15 bg-white/10 p-1.5">
            <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-[17px] bg-white object-cover" />
          </Link>
        </div>
      </header>

      <div className="page-x space-y-6 py-5">
        <section>
          <SectionTitle title="快捷工作台" />
          <QuickLink to="/assistant" icon={<Bot size={21} />} label="业务助手" description="询问操作规范、异常处置和业务规则" />
        </section>

        <section>
          <SectionTitle title="业务异常" />
          <Link to={`/events/${businessEvents[0].id}`} className="tap block rounded-[26px] border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-primary text-white"><CircleAlert size={22} /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-gray-950">{businessEvents[0].title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-gray-500">{businessEvents[0].summary}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-gray-400">
                  <span>{businessEvents[0].errorCode} · {businessEvents[0].waybill}</span>
                  <span>{businessEvents[0].time}</span>
                </div>
              </div>
              <span className="mt-1 flex flex-none items-center gap-0.5 text-[10px] font-bold text-primary">查看详情<ChevronRight size={15} /></span>
            </div>
          </Link>
        </section>

        <section>
          <SectionTitle title="今日任务" />
          <div className="space-y-3">
            <AutomaticPlanCard progress={planProgress} done={passed} />
            {tasks.map(task => <HomeTaskCard key={task.id} task={task} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function AutomaticPlanCard({ progress, done }: { progress: number; done: boolean }) {
  const plan = trainingPlans[0];
  return (
    <Link to={`/plans/${plan.id}`} className="tap block rounded-[24px] border border-red-100 bg-white p-4 shadow-sm hover:border-red-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-black text-white">自动推荐</span>
          </div>
          <h3 className="mt-2 text-sm font-black text-gray-900">{plan.title}</h3>
          <p className="mt-1.5 text-[11px] leading-5 text-gray-500">{plan.reason}</p>
        </div>
        <ChevronRight size={18} className="mt-1 flex-none text-gray-300" />
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold">
          <span className={done ? "text-green-600" : "text-amber-600"}>{done ? "计划已完成" : plan.dueText}</span>
          <span className={done ? "text-green-600" : "text-primary"}>{progress}%</span>
        </div>
        <ProgressBar value={progress} color={done ? "bg-green-500" : "bg-primary"} />
      </div>
    </Link>
  );
}

function HomeTaskCard({ task }: { key?: string; task: HomeTask }) {
  const isDone = task.status === "done";
  const isLocked = task.status === "locked";
  const statusLabel = {
    done: "已完成",
    in_progress: "进行中",
    todo: "待完成",
    locked: "未解锁",
    retrain: "待补训"
  }[task.status];
  const typeLabel = task.type === "course" ? "学习任务" : task.type === "practice" ? "练习任务" : "考试任务";
  const icon = task.type === "course" ? <BookOpen size={20} /> : task.type === "practice" ? <MessagesSquare size={20} /> : <ClipboardCheck size={20} />;
  const progress = Math.round((task.progressCurrent / task.progressTarget) * 100);
  const route = isLocked ? "/plans/plan-pda-001" : task.route;

  return (
    <Link
      to={route}
      className={`tap flex items-start gap-4 rounded-[24px] border p-4 shadow-sm transition-all ${
        isDone ? "border-green-100 bg-green-50/50" : isLocked ? "border-gray-100 bg-white opacity-75" : "border-gray-100 bg-white hover:border-red-200 hover:shadow-md"
      }`}
    >
      <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${
        isDone
          ? "bg-green-100 text-green-600"
          : task.type === "course"
            ? "bg-indigo-50 text-indigo-500"
            : task.type === "practice"
              ? "bg-red-50 text-primary"
              : "bg-orange-50 text-orange-500"
      }`}>
        {isDone ? <CheckCircle2 size={22} /> : icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{typeLabel}</span>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
            isDone ? "bg-green-100 text-green-600" : task.status === "retrain" ? "bg-amber-100 text-amber-700" : isLocked ? "bg-gray-100 text-gray-500" : "bg-red-50 text-primary"
          }`}>{statusLabel}</span>
        </div>
        <p className={`text-sm font-black leading-tight ${isDone ? "text-green-800" : "text-gray-800"}`}>{task.title}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {task.tags.map(tag => <span key={tag} className="rounded-full bg-gray-50 px-2 py-1 text-[9px] font-bold text-gray-500">{tag}</span>)}
        </div>
        <div className="mt-3">
          <div className="mb-1.5 flex justify-between text-[10px] font-bold">
            <span className="flex items-center gap-1 text-gray-400"><Timer size={11} />{task.dueText}</span>
            <span className={isDone ? "text-green-600" : "text-primary"}>{task.progressCurrent}/{task.progressTarget}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${isDone ? "bg-green-500" : "bg-primary"}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <ChevronRight size={18} className={isDone ? "text-green-400" : "text-gray-300"} />
    </Link>
  );
}

function QuickLink({ to, icon, label, description }: { to: string; icon: ReactNode; label: string; description: string }) {
  return <Link to={to} className="tap card flex items-center gap-3 p-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary">{icon}</span><span className="min-w-0 flex-1"><strong className="block text-sm text-gray-900">{label}</strong><span className="mt-1 block text-[11px] leading-5 text-gray-500">{description}</span></span><ChevronRight size={18} className="flex-none text-gray-300" /></Link>;
}
