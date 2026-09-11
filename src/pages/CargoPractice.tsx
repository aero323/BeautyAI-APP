import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, BookOpen, Bot, Check, CheckCircle2, Lightbulb, LockKeyhole, MessageCircle, Mic, RotateCcw, Send, Target, Timer } from "lucide-react";
import { PageHeader, Pill, ProgressBar } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import signFailureBackground from "../assets/practice-scenes/sign-failure-courier-background.webp";

type Phase = "intro" | "practice" | "result";

interface ScenarioStep {
  title: string;
  prompt: string;
  sop: string;
  actorLine: string;
  sampleReply: string;
  coachReply: string;
}

interface Scenario {
  title: string;
  subtitle: string;
  background: string;
  backgroundImage?: string;
  steps: ScenarioStep[];
}

interface DialogueMessage {
  role: "assistant" | "user";
  speaker: string;
  text: string;
}

const AI_SCENE_ROLE = "AI 场景助手";

const scenarios: Record<string, Scenario> = {
  "pda-scan": {
    title: "PDA 错扫处理场景模拟",
    subtitle: "专项计划 · 3 个 SOP 节点",
    background: "运单 JT3049827156 在派件时误扫为问题件，包裹仍在现场，PDA 已产生一条错误业务轨迹。",
    steps: [
      {
        title: "核对信息",
        prompt: "发现错扫后，你首先应该做什么？",
        sop: "停止后续操作，并完成实物、运单与轨迹三方核对。",
        actorLine: "检测到运单 JT3049827156 的派件节点可能选择错误，包裹仍在现场。请说明你会先做什么。",
        sampleReply: "我会先停止后续操作，核对包裹实物、运单号和最新业务轨迹，确认是否为节点错扫。",
        coachReply: "信息核对完成，实物与运单一致，确认为节点选择错误。下一步需要处理错误轨迹。"
      },
      {
        title: "撤销错扫",
        prompt: "确认节点选择错误后，下一步怎么处理？",
        sop: "进入最近扫描记录，撤销错误节点并选择“节点选择错误”。",
        actorLine: "已定位最近一次错误扫描记录。请说明如何撤销，并记录什么原因。",
        sampleReply: "我会进入最近扫描记录撤销错误节点，原因填写“节点选择错误”，并确认撤销结果。",
        coachReply: "错误节点已撤销，原因记录完整。系统现在等待你重新完成正确节点扫描。"
      },
      {
        title: "重新扫描",
        prompt: "撤销成功后，怎样完成闭环？",
        sop: "按正确节点重扫，核对成功提示及最新业务轨迹。",
        actorLine: "撤销已生效，包裹仍在现场。请说明如何完成本次错扫处理闭环。",
        sampleReply: "我会选择正确的派件节点重新扫描，确认成功提示和最新业务轨迹都已更新。",
        coachReply: "处理完成。重新扫描成功，业务轨迹已恢复正常，三个 SOP 节点全部覆盖。"
      }
    ]
  },
  "sign-failure": {
    title: "签收失败处理场景模拟",
    subtitle: "自由练习 · 3 个 SOP 节点",
    background: "派送时连续两次拨打收件人电话无人接听，现场无法确认具体门牌。",
    backgroundImage: signFailureBackground,
    steps: [
      {
        title: "联系留痕",
        prompt: "电话无人接听时，应先怎么做？",
        sop: "按时间间隔完成联系，并保留电话或消息记录。",
        actorLine: "你已连续两次拨打收件人电话，仍无人接听，现场也无法确认具体门牌。请说明你会如何处理。",
        sampleReply: "我会按规定继续联系，通过电话和消息完成留痕，不会直接签收或退件。",
        coachReply: "联系记录已保存。运单地址只有社区名称，缺少具体门牌，需要进一步核验。"
      },
      {
        title: "核验地址",
        prompt: "无法确认门牌时，应选择哪种处理？",
        sop: "通过网点或客户资料核验地址，不得代替客户确认。",
        actorLine: "当前地址信息不完整，现场无法确认门牌。你需要网点提供什么协助？",
        sampleReply: "请帮我结合客户资料核验详细地址，我会在确认门牌后再继续安排派送。",
        coachReply: "网点已补充详细地址。收件人随后回复今天无法收件，需要安排复派。"
      },
      {
        title: "预约复派",
        prompt: "仍无法完成派送时，应如何闭环？",
        sop: "登记联系失败原因，按规定带回并预约复派。",
        actorLine: "不好意思，今天不方便收件，可以明天下午再送吗？",
        sampleReply: "可以，我会登记本次联系失败原因，将包裹按规定带回网点，并为您预约明天下午复派。",
        coachReply: "沟通完成。联系留痕、地址核验和复派预约均符合 SOP，本次场景处理完成。"
      }
    ]
  },
  "refuse-delivery": {
    title: "客户拒收处理场景模拟",
    subtitle: "自由练习 · 3 个 SOP 节点",
    background: "收件人现场表示未购买该商品并拒绝签收，包裹外包装完好。",
    steps: [
      {
        title: "核实原因",
        prompt: "客户提出拒收后，首先应该怎么做？",
        sop: "礼貌确认拒收原因及包裹状态。",
        actorLine: "这个包裹不是我买的，我不收。",
        sampleReply: "好的，我先和您核实一下拒收原因，并确认包裹和外包装状态，不会直接操作退件。",
        coachReply: "客户确认未购买商品，包裹外包装完好。下一步需要完成证据留存。"
      },
      {
        title: "留存证据",
        prompt: "需要保留哪些材料？",
        sop: "完整留存包裹、面单和沟通证据。",
        actorLine: "拒收原因已记录。请说明你还需要上传和保留哪些材料。",
        sampleReply: "我会按规范拍摄包裹外观和面单，并保留与收件人的沟通记录。",
        coachReply: "照片与沟通记录已保存，材料完整，可以提交拒收处理。"
      },
      {
        title: "提交处理",
        prompt: "证据完成后，正确操作是？",
        sop: "选择正确异常类型，提交登记并带回网点。",
        actorLine: "拒收证据已齐全。请说明最后如何提交并处理包裹。",
        sampleReply: "我会选择正确的拒收异常类型提交登记，等待审核，并按规定将包裹带回网点。",
        coachReply: "拒收登记已提交，证据和包裹流转符合要求，本次场景处理完成。"
      }
    ]
  }
};

export function CargoPractice() {
  const { id = "pda-scan" } = useParams();
  const navigate = useNavigate();
  const { completedStages, completeStage } = useCargo();
  const scenario = scenarios[id] ?? scenarios["pda-scan"];
  const courseDone = completedStages.includes("plan-pda-001:course");
  const alreadyDone = id === "pda-scan" && completedStages.includes("plan-pda-001:practice");
  const locked = id === "pda-scan" && !courseDone;
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState<DialogueMessage[]>([
    { role: "assistant", speaker: AI_SCENE_ROLE, text: scenario.steps[0].actorLine }
  ]);
  const [replies, setReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const current = scenario.steps[index];

  useEffect(() => {
    const firstStep = scenario.steps[0];
    setPhase("intro");
    setIndex(0);
    setMessages([{ role: "assistant", speaker: AI_SCENE_ROLE, text: firstStep.actorLine }]);
    setReplies([]);
    setInput("");
    setIsReplying(false);
    setIsTransitioning(false);
    setIsRecording(false);
    setShowHint(false);
  }, [scenario]);

  useEffect(() => () => {
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isReplying]);

  const sendReply = (text = input.trim()) => {
    const reply = text.trim();
    if (!reply || isReplying || isTransitioning) return;
    setReplies(previous => {
      const nextReplies = [...previous];
      nextReplies[index] = reply;
      return nextReplies;
    });
    setMessages(previous => [...previous, { role: "user", speaker: "我", text: reply }]);
    setInput("");
    setShowHint(false);
    setIsReplying(true);
    replyTimerRef.current = window.setTimeout(() => {
      setMessages(previous => [...previous, { role: "assistant", speaker: AI_SCENE_ROLE, text: current.coachReply }]);
      setIsReplying(false);
      setIsTransitioning(true);
      transitionTimerRef.current = window.setTimeout(() => {
        advanceDialogue();
      }, 900);
    }, 650);
  };

  const simulateVoiceReply = () => {
    if (isRecording || isReplying || isTransitioning) return;
    setIsRecording(true);
    window.setTimeout(() => {
      setIsRecording(false);
      sendReply(current.sampleReply);
    }, 900);
  };

  const advanceDialogue = () => {
    if (index < scenario.steps.length - 1) {
      const nextIndex = index + 1;
      const nextStep = scenario.steps[nextIndex];
      setIndex(nextIndex);
      setMessages(previous => [...previous, { role: "assistant", speaker: AI_SCENE_ROLE, text: nextStep.actorLine }]);
      setIsTransitioning(false);
      setShowHint(false);
      return;
    }
    if (id === "pda-scan") completeStage("plan-pda-001:practice");
    setPhase("result");
  };

  const restartScenario = () => {
    const firstStep = scenario.steps[0];
    setIndex(0);
    setMessages([{ role: "assistant", speaker: AI_SCENE_ROLE, text: firstStep.actorLine }]);
    setReplies([]);
    setInput("");
    setIsReplying(false);
    setIsTransitioning(false);
    setIsRecording(false);
    setShowHint(false);
    setPhase("practice");
  };

  if (locked) return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="场景模拟" subtitle="PDA 错扫处理" />
      <div className="page-x py-8">
        <div className="card px-6 py-9 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-gray-100 text-gray-400"><LockKeyhole size={24} /></span><h2 className="mt-4 font-black text-gray-900">完成课程后解锁</h2><p className="mt-2 text-xs leading-5 text-gray-500">先学习 PDA 错扫纠正专项课，再进入本次场景模拟。</p><Link to="/course/course-scan-correction" className="tap mt-5 inline-flex rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white">去完成课程</Link></div>
      </div>
    </div>
  );

  if (phase === "intro") return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="场景模拟" subtitle={scenario.subtitle} />
      <div className="page-x py-5">
        <div className="relative min-h-[180px] overflow-hidden rounded-[28px] bg-gray-950 p-6 text-white shadow-lg">
          {scenario.backgroundImage && <img src={scenario.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />}
          {scenario.backgroundImage && <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/65" />}
          <div className="relative z-10">
            <Pill tone={alreadyDone ? "green" : "red"}>{alreadyDone ? "已完成 · 可再次模拟" : "业务场景"}</Pill>
            <h1 className="mt-4 text-xl font-black">{scenario.title}</h1>
            <p className="mt-3 max-w-[90%] text-xs leading-6 text-gray-200">{scenario.background}</p>
          </div>
        </div>
        <div className="card mt-4 p-5">
          <div className="flex items-center gap-2"><Target size={18} className="text-primary" /><h2 className="font-black">模拟步骤</h2></div>
          <div className="mt-4 space-y-4">
            {scenario.steps.map((step, stepIndex) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-red-50 text-[11px] font-black text-primary">{stepIndex + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-gray-800">{step.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500">{step.sop}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setPhase("practice")} className="tap mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-black text-white">开始场景模拟</button>
      </div>
    </div>
  );

  if (phase === "result") return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="模拟结果" subtitle={scenario.title} />
      <div className="page-x py-5">
        <div className="rounded-[28px] bg-green-700 p-6 text-center text-white shadow-lg"><CheckCircle2 size={42} className="mx-auto text-green-200" /><p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">综合评分</p><p className="mt-2 text-5xl font-black">93</p><p className="mt-3 text-sm font-black">本次处置符合标准流程</p></div>

        <div className="card mt-4 p-5">
          <h2 className="font-black">能力评分</h2>
          <div className="mt-4 space-y-4">
            <PracticeScore icon={<Target size={15} />} label="SOP 完成度" score={100} />
            <PracticeScore icon={<Timer size={15} />} label="处理效率" score={88} />
            <PracticeScore icon={<MessageCircle size={15} />} label="沟通质量" score={92} />
          </div>
        </div>

        <div className="card mt-4 p-5">
          <div className="flex items-center justify-between"><h2 className="font-black">关键步骤复盘</h2><Pill tone="green">无遗漏</Pill></div>
          <div className="mt-4 space-y-4">
            {scenario.steps.map((step, stepIndex) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-50 text-green-600"><Check size={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-gray-800">{step.title} · 已完成</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500">{step.sop}</p>
                  <p className="mt-2 rounded-xl bg-gray-50 px-3 py-2 text-[10px] leading-5 text-gray-500">你的回复：{replies[stepIndex]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-900"><AlertTriangle size={17} /><h2 className="font-black">可优化项</h2></div>
          <p className="mt-2 text-xs leading-6 text-amber-800">关键步骤没有遗漏。部分回复可以先明确当前结论，再说明后续动作，让现场沟通更简洁。</p>
        </div>

        <div className="card mt-4 p-5">
          <div className="flex items-center gap-2"><Lightbulb size={17} className="text-primary" /><h2 className="font-black">改进建议</h2></div>
          <ul className="mt-3 space-y-2 text-xs leading-6 text-gray-600">
            <li>· 使用“先暂停—再核对—后处理”的表达顺序。</li>
            <li>· 每次系统操作后，主动复核最新业务轨迹。</li>
          </ul>
          <Link to={id === "sign-failure" ? "/course/course-sign-failure" : "/course/course-scan-correction"} className="tap mt-4 flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-red-50 text-primary"><BookOpen size={17} /></span>
            <span className="min-w-0 flex-1"><span className="block text-[10px] text-gray-400">推荐复习内容</span><span className="mt-0.5 block text-xs font-black text-gray-800">{id === "sign-failure" ? "签收失败的四步处理法" : "PDA 错扫纠正专项课"}</span></span>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => navigate(id === "pda-scan" ? "/plans/plan-pda-001" : "/practice")} className="tap rounded-2xl border border-gray-200 bg-white py-4 text-sm font-black text-gray-700">{id === "pda-scan" ? "返回计划" : "返回练习"}</button>
          <button onClick={restartScenario} className="tap flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black text-white"><RotateCcw size={16} />再次模拟</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <PageHeader title={scenario.title} subtitle={`第 ${index + 1}/${scenario.steps.length} 个节点 · ${current.title}`} />
      <div className="flex-none border-b border-gray-100 bg-white px-5 pb-4 pt-3">
        <ProgressBar value={((index + 1) / scenario.steps.length) * 100} />
        <div className="mt-3 flex gap-2">
          {scenario.steps.map((step, stepIndex) => (
            <span key={step.title} className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-2 py-2 text-[9px] font-black ${stepIndex < index ? "bg-green-50 text-green-700" : stepIndex === index ? "bg-red-50 text-primary" : "bg-gray-100 text-gray-400"}`}>
              {stepIndex < index && <Check size={11} />}
              <span className="truncate">{step.title}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-4 rounded-[20px] border border-red-100 bg-red-50/70 px-4 py-3">
          <p className="text-[10px] font-black text-primary">当前对话目标</p>
          <p className="mt-1 text-[11px] leading-5 text-gray-600">{current.prompt}</p>
        </div>

        <div className="space-y-5">
          {messages.map((message, messageIndex) => (
            <div key={`${message.role}-${messageIndex}`} className={`flex max-w-[88%] items-start gap-2.5 ${message.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              {message.role !== "user" && (
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary">
                  <Bot size={18} />
                </span>
              )}
              <div>
                <p className={`mb-1 text-[9px] font-bold text-gray-400 ${message.role === "user" ? "text-right" : ""}`}>{message.speaker}</p>
                <div className={`rounded-[22px] px-4 py-3 text-xs leading-6 shadow-sm ${message.role === "user" ? "rounded-tr-md bg-primary text-white" : "rounded-tl-md border border-gray-100 bg-white text-gray-700"}`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {isReplying && (
            <div className="flex max-w-[88%] items-start gap-2.5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary"><Bot size={18} /></span>
              <div><p className="mb-1 text-[9px] font-bold text-gray-400">{AI_SCENE_ROLE}</p><div className="flex gap-1 rounded-[22px] rounded-tl-md border border-gray-100 bg-white px-4 py-4"><span className="pulse-soft h-1.5 w-1.5 rounded-full bg-primary" /><span className="pulse-soft h-1.5 w-1.5 rounded-full bg-primary" /><span className="pulse-soft h-1.5 w-1.5 rounded-full bg-primary" /></div></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-none border-t border-gray-100 bg-white p-4 pb-safe shadow-[0_-8px_24px_rgba(17,24,39,0.04)]">
        {showHint && !isTransitioning && (
          <div className="mb-3 flex items-start gap-2 rounded-[18px] bg-amber-50 px-3 py-2.5 text-[10px] leading-5 text-amber-800">
            <Lightbulb size={15} className="mt-0.5 flex-none" />
            <span><strong>回复提示：</strong>{current.sop}</span>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button onClick={simulateVoiceReply} disabled={isRecording || isReplying || isTransitioning} className={`tap flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white disabled:opacity-50 ${isRecording ? "bg-red-700" : "bg-gray-900"}`} aria-label="模拟语音回复">
            <Mic size={19} className={isRecording ? "pulse-soft" : ""} />
          </button>
          <textarea value={input} onChange={event => setInput(event.target.value)} disabled={isReplying || isRecording || isTransitioning} rows={1} placeholder={isRecording ? "正在识别语音…" : isTransitioning ? "对话继续中…" : "输入你的处理话术…"} className="min-h-12 min-w-0 flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-5 outline-none focus:border-primary disabled:opacity-60" />
          <button onClick={() => sendReply()} disabled={!input.trim() || isReplying || isRecording || isTransitioning} className="tap flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-30" aria-label="发送回复"><Send size={18} /></button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <button onClick={() => setShowHint(value => !value)} disabled={isTransitioning} className={`flex items-center gap-1 text-[10px] font-bold disabled:opacity-40 ${showHint ? "text-amber-700" : "text-gray-400"}`}><Lightbulb size={13} />{showHint ? "收起提示" : "查看提示"}</button>
          <span className="text-[10px] text-gray-400">点击麦克风可模拟语音回复</span>
        </div>
      </div>
    </div>
  );
}

function PracticeScore({ icon, label, score }: { icon: ReactNode; label: string; score: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-2 text-gray-600"><span className="text-primary">{icon}</span>{label}</span>
        <span className="text-gray-900">{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} /></div>
    </div>
  );
}
