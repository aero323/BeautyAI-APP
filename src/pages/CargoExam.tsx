import { useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  FileImage,
  FileUp,
  Play,
  RotateCcw,
  Video,
  XCircle
} from "lucide-react";
import { PageHeader, Pill, ProgressBar } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";

type Phase = "intro" | "exam" | "result";
type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "paragraph"
  | "dropdown"
  | "sorting"
  | "matrix"
  | "file_upload"
  | "fill_blank"
  | "image_choice"
  | "video_question"
  | "scenario";

interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  prompt: string;
  explanation: string;
}

interface ChoiceQuestion extends BaseQuestion {
  type: "single_choice" | "image_choice" | "video_question";
  options: readonly string[];
  answerIndex: number;
  image?: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  options: readonly string[];
  answerIndexes: readonly number[];
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "true_false";
  answer: boolean;
}

interface TextQuestion extends BaseQuestion {
  type: "paragraph" | "fill_blank";
  placeholder: string;
  correctAnswer: string;
}

interface DropdownQuestion extends BaseQuestion {
  type: "dropdown";
  options: readonly string[];
  answerIndex: number;
}

interface SortingQuestion extends BaseQuestion {
  type: "sorting";
  items: readonly string[];
  correctOrder: readonly string[];
}

interface MatrixQuestion extends BaseQuestion {
  type: "matrix";
  rows: readonly string[];
  columns: readonly string[];
  answers: readonly number[];
}

interface FileUploadQuestion extends BaseQuestion {
  type: "file_upload";
  accept: string;
  correctAnswer: string;
}

interface ScenarioQuestion extends BaseQuestion {
  type: "scenario";
  stages: readonly {
    prompt: string;
    options: readonly string[];
  }[];
  answerIndexes: readonly number[];
}

type ExamQuestion =
  | ChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | TextQuestion
  | DropdownQuestion
  | SortingQuestion
  | MatrixQuestion
  | FileUploadQuestion
  | ScenarioQuestion;

interface ExamResponse {
  selectedIndex?: number;
  selectedIndexes?: number[];
  booleanValue?: boolean;
  text?: string;
  dropdownIndex?: number;
  order?: string[];
  matrix?: Record<number, number>;
  fileName?: string;
  scenarioIndexes?: number[];
}

type Answers = Record<string, ExamResponse>;

const questions: readonly ExamQuestion[] = [
  {
    id: "single",
    type: "single_choice",
    title: "单选题",
    prompt: "发现 PDA 节点错扫后，首先应该怎么做？",
    options: ["继续完成后续扫描", "停止操作并核对实物、运单和轨迹", "直接登记退件"],
    answerIndex: 1,
    explanation: "先停止后续操作，才能避免错误轨迹继续扩大。"
  },
  {
    id: "multiple",
    type: "multiple_choice",
    title: "多选题",
    prompt: "撤销错扫前，需要核对哪些信息？",
    options: ["包裹实物", "运单号", "最新业务轨迹", "手机电量"],
    answerIndexes: [0, 1, 2],
    explanation: "实物、运单号和最新轨迹需要三方一致，手机电量不属于业务核验项。"
  },
  {
    id: "boolean",
    type: "true_false",
    title: "判断题",
    prompt: "错扫已经写入系统时，只要包裹仍在现场，就可以忽略该条错误轨迹。",
    answer: false,
    explanation: "错误轨迹必须按规定撤销或登记异常，不能因为包裹在场而忽略。"
  },
  {
    id: "paragraph",
    type: "paragraph",
    title: "简答题",
    prompt: "请用一句话说明撤销错扫后的闭环动作。",
    placeholder: "请输入处理说明…",
    correctAnswer: "选择正确节点重新扫描，并核对成功提示与最新业务轨迹。",
    explanation: "回答需要同时覆盖重新扫描和轨迹确认。"
  },
  {
    id: "dropdown",
    type: "dropdown",
    title: "下拉题",
    prompt: "撤销错误节点时，最准确的原因是：",
    options: ["设备故障", "节点选择错误", "客户拒收", "无法联系客户"],
    answerIndex: 1,
    explanation: "原因应与事实一致，便于后续审计和问题追踪。"
  },
  {
    id: "sorting",
    type: "sorting",
    title: "排序题",
    prompt: "请将 PDA 错扫处置步骤调整为正确顺序。",
    items: ["撤销错误节点并填写原因", "确认成功提示与最新轨迹", "核对实物、运单和轨迹", "选择正确节点重新扫描"],
    correctOrder: ["核对实物、运单和轨迹", "撤销错误节点并填写原因", "选择正确节点重新扫描", "确认成功提示与最新轨迹"],
    explanation: "标准顺序是先核对，再撤销、重扫，最后确认系统轨迹。"
  },
  {
    id: "matrix",
    type: "matrix",
    title: "矩阵题",
    prompt: "为每种情况选择最合适的处理方式。",
    rows: ["错扫且可撤销", "撤销入口不可用", "重扫后轨迹未更新"],
    columns: ["正常处置", "登记异常", "升级负责人"],
    answers: [0, 1, 2],
    explanation: "正常可撤销按 SOP 处置；功能不可用需登记异常；轨迹未恢复需立即升级。"
  },
  {
    id: "upload",
    type: "file_upload",
    title: "上传题",
    prompt: "请上传一张能够完整呈现报错码和运单号的 PDA 截图。",
    accept: ".png,.jpg,.jpeg,.pdf",
    correctAnswer: "已上传包含报错码和运单号的现场截图",
    explanation: "截图应同时包含报错信息和业务对象，便于远程判断。"
  },
  {
    id: "fill",
    type: "fill_blank",
    title: "填空题",
    prompt: "撤销错扫后，应选择正确节点重新扫描，并核对成功提示与最新 ______。",
    placeholder: "请输入答案",
    correctAnswer: "业务轨迹",
    explanation: "重新扫描完成不等于闭环，还需确认最新业务轨迹已经更新。"
  },
  {
    id: "image",
    type: "image_choice",
    title: "图片题",
    prompt: "观察操作现场，重新扫描前最需要先确认什么？",
    options: ["包裹实物、运单号与任务一致", "手机电量是否充足", "客户是否已评价"],
    answerIndex: 0,
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
    explanation: "现场处置应先确认实物、运单和当前任务属于同一票快件。"
  },
  {
    id: "video",
    type: "video_question",
    title: "视频题",
    prompt: "视频定位到 01:35。撤销错扫后，下一步正确操作是？",
    options: ["关闭 PDA 等待", "选择正确节点重新扫描并确认轨迹", "直接登记退件"],
    answerIndex: 1,
    explanation: "视频演示的关键动作是重扫正确节点并确认轨迹恢复。"
  },
  {
    id: "scenario",
    type: "scenario",
    title: "场景题",
    prompt: "撤销入口不可用，但包裹仍在现场。请连续完成两步处置判断。",
    stages: [
      {
        prompt: "第一步：此时应该怎么处理？",
        options: ["继续派送，稍后再说", "暂停操作并登记异常件", "删除派件任务"]
      },
      {
        prompt: "第二步：登记后如何继续推进？",
        options: ["上传现场材料并通知负责人", "直接改为客户拒收", "重新登录后不再核验"]
      }
    ],
    answerIndexes: [1, 0],
    explanation: "系统功能不可用时，应暂停操作、登记异常并上传材料，由负责人协助处理。"
  }
];

const questionTypeLabels: Record<QuestionType, string> = {
  single_choice: "单选题",
  multiple_choice: "多选题",
  true_false: "判断题",
  paragraph: "简答题",
  dropdown: "下拉题",
  sorting: "排序题",
  matrix: "矩阵题",
  file_upload: "上传题",
  fill_blank: "填空题",
  image_choice: "图片题",
  video_question: "视频题",
  scenario: "场景题"
};

export function CargoExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { examAttempts, completedStages, submitExam } = useCargo();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<{ attempt: number; score: number; passed: boolean }>();
  const attempts = examAttempts[id ?? "pda-scan"] ?? 0;
  const practiceDone = completedStages.includes("plan-pda-001:practice");
  const retrainDone = completedStages.includes("plan-pda-001:retrain");
  const canStart = attempts === 0 ? practiceDone : retrainDone || attempts >= 2;
  const question = questions[index];
  const currentResponse = answers[question.id] ?? {};
  const answered = isAnswered(question, currentResponse);
  const answeredCount = questions.filter(item => isAnswered(item, answers[item.id] ?? {})).length;

  const updateResponse = (questionId: string, patch: Partial<ExamResponse>) => {
    setAnswers(previous => ({
      ...previous,
      [questionId]: { ...(previous[questionId] ?? {}), ...patch }
    }));
  };

  const submit = () => {
    const nextResult = submitExam(id ?? "pda-scan");
    setResult(nextResult);
    setPhase("result");
  };

  const introHistory = useMemo(
    () => attempts === 0 ? [] : Array.from({ length: attempts }, (_, attemptIndex) => ({
      attempt: attemptIndex + 1,
      score: attemptIndex === 0 ? 68 : 92
    })),
    [attempts]
  );

  if (phase === "intro") return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="专项考试" subtitle="PDA 错扫处理" />
      <div className="page-x py-5">
        <div className="rounded-[28px] bg-gray-950 p-6 text-white shadow-lg">
          <Pill tone="red">专项考试</Pill>
          <h1 className="mt-4 text-2xl font-black">PDA 扫描异常专项考试</h1>
          <p className="mt-3 text-sm leading-6 text-gray-300">覆盖 12 类题型，检验知识理解、现场判断和材料留存能力。80 分通过。</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <ExamMeta icon={<FileImage size={16} />} value="12题" />
            <ExamMeta icon={<Clock3 size={16} />} value="18分钟" />
            <ExamMeta icon={<CheckCircle2 size={16} />} value="80分" />
          </div>
        </div>
        {introHistory.length > 0 && (
          <div className="card mt-4 p-5">
            <h2 className="font-black">考试记录</h2>
            <div className="mt-3 space-y-2">
              {introHistory.map(item => (
                <div key={item.attempt} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-xs">
                  <span>第 {item.attempt} 次考试</span>
                  <span className={`font-black ${item.score >= 80 ? "text-green-600" : "text-amber-600"}`}>{item.score} 分 · {item.score >= 80 ? "通过" : "未通过"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!canStart && (
          <div className="mt-4 flex items-start gap-3 rounded-[22px] bg-amber-50 p-4 text-xs leading-5 text-amber-800">
            <AlertTriangle size={18} className="mt-0.5 flex-none" />
            {attempts > 0 ? "请先完成系统追加的易错点补训，再参加重考。" : "请先完成场景模拟，再参加本次考试。"}
          </div>
        )}
        <button onClick={() => setPhase("exam")} disabled={!canStart} className="tap mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-black text-white disabled:opacity-30">{attempts > 0 ? "开始重考" : "开始考试"}</button>
      </div>
    </div>
  );

  if (phase === "result" && result) return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="考试结果" subtitle={`第 ${result.attempt} 次考试`} />
      <div className="page-x py-5">
        <div className={`rounded-[28px] p-6 text-center text-white shadow-lg ${result.passed ? "bg-green-700" : "bg-gray-950"}`}>
          {result.passed ? <CheckCircle2 size={43} className="mx-auto text-green-200" /> : <RotateCcw size={43} className="mx-auto text-amber-300" />}
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">考试得分</p>
          <p className="mt-2 text-6xl font-black">{result.score}</p>
          <p className="mt-3 text-sm font-black">{result.passed ? "考试通过，培训闭环完成" : "未达到 80 分通过线"}</p>
        </div>

        {!result.passed && (
          <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-black text-amber-900">已自动生成补训</h2>
            <p className="mt-2 text-xs leading-6 text-amber-800">易错点集中在多选核对、处置排序和场景分支。完成补训课程后可再次考试。</p>
          </div>
        )}

        <QuestionReview answers={answers} />

        {result.passed ? (
          <>
            <div className="card mt-4 p-5">
              <h2 className="font-black">完成回执</h2>
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <p className="flex items-center gap-2"><Check size={15} className="text-green-600" />学习结果已回传培训中心</p>
                <p className="flex items-center gap-2"><Check size={15} className="text-green-600" />业务事件专项培训状态已关闭</p>
                <p className="flex items-center gap-2"><Check size={15} className="text-green-600" />120 积分已计入本月流水</p>
              </div>
            </div>
            <button onClick={() => navigate("/plans/plan-pda-001")} className="tap mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-black text-white">返回已完成计划</button>
          </>
        ) : (
          <button onClick={() => navigate("/plans/plan-pda-001")} className="tap mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-black text-white">查看补训计划</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PageHeader title="PDA 扫描异常专项考试" subtitle={`第 ${index + 1}/${questions.length} 题 · ${question.title}`} />
      <div className="px-5 pt-4">
        <div className="mb-2 flex justify-between text-[10px] font-bold text-gray-400"><span>已作答 {answeredCount}/{questions.length}</span><span>剩余 17:42</span></div>
        <ProgressBar value={((index + 1) / questions.length) * 100} />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <Pill tone="red">{questionTypeLabels[question.type]}</Pill>
        <h2 className="mt-3 text-base font-black leading-7 text-gray-900">{question.prompt}</h2>
        <div className="mt-5">
          <QuestionBody question={question} response={currentResponse} update={patch => updateResponse(question.id, patch)} />
        </div>
      </div>
      <div className="flex gap-3 border-t border-gray-100 bg-white p-4 pb-safe">
        <button onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0} className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 text-gray-500 disabled:opacity-30"><ChevronLeft size={20} /></button>
        <button onClick={() => index === questions.length - 1 ? submit() : setIndex(value => value + 1)} disabled={!answered} className="tap flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-black text-white disabled:opacity-30">
          {index === questions.length - 1 ? "提交考试" : "下一题"}<ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function QuestionBody({ question, response, update }: { question: ExamQuestion; response: ExamResponse; update: (patch: Partial<ExamResponse>) => void }) {
  const [playing, setPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (question.type === "single_choice") {
    return <Options options={question.options} value={response.selectedIndex} onChange={selectedIndex => update({ selectedIndex })} />;
  }

  if (question.type === "multiple_choice") {
    return <MultiOptions options={question.options} values={response.selectedIndexes ?? []} onChange={selectedIndexes => update({ selectedIndexes })} />;
  }

  if (question.type === "true_false") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[{ label: "正确", value: true }, { label: "错误", value: false }].map(option => (
          <button key={option.label} onClick={() => update({ booleanValue: option.value })} className={`tap min-h-28 rounded-[22px] border-2 text-sm font-black ${response.booleanValue === option.value ? "border-primary bg-red-50 text-primary" : "border-gray-100 bg-white text-gray-700"}`}>{option.label}</button>
        ))}
      </div>
    );
  }

  if (question.type === "paragraph" || question.type === "fill_blank") {
    return question.type === "paragraph" ? (
      <div>
        <textarea value={response.text ?? ""} onChange={event => update({ text: event.target.value })} rows={6} placeholder={question.placeholder} className="w-full resize-none rounded-[22px] border-2 border-gray-200 bg-white px-4 py-4 text-sm leading-6 outline-none focus:border-primary" />
        <p className="mt-2 text-right text-[10px] text-gray-400">{response.text?.length ?? 0} 字</p>
      </div>
    ) : (
      <input value={response.text ?? ""} onChange={event => update({ text: event.target.value })} placeholder={question.placeholder} className="w-full rounded-[22px] border-2 border-gray-200 bg-white px-4 py-4 text-sm outline-none focus:border-primary" />
    );
  }

  if (question.type === "dropdown") {
    return (
      <select value={response.dropdownIndex ?? ""} onChange={event => update({ dropdownIndex: Number(event.target.value) })} className="w-full rounded-[22px] border-2 border-gray-200 bg-white px-4 py-4 text-sm font-semibold outline-none focus:border-primary">
        <option value="" disabled>请选择一个答案</option>
        {question.options.map((option, optionIndex) => <option key={option} value={optionIndex}>{option}</option>)}
      </select>
    );
  }

  if (question.type === "sorting") {
    const order = response.order ?? [...question.items];
    const moveItem = (itemIndex: number, direction: -1 | 1) => {
      const targetIndex = itemIndex + direction;
      if (targetIndex < 0 || targetIndex >= order.length) return;
      const nextOrder = [...order];
      [nextOrder[itemIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[itemIndex]];
      update({ order: nextOrder });
    };
    return (
      <div>
        <p className="mb-3 text-[10px] leading-5 text-gray-400">点击右侧箭头调整顺序，完成一次操作后即可继续。</p>
        <div className="space-y-3">
          {order.map((item, itemIndex) => (
            <div key={item} className="flex items-center gap-3 rounded-[20px] border border-gray-100 bg-white p-3 shadow-sm">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-50 text-[11px] font-black text-primary">{itemIndex + 1}</span>
              <span className="min-w-0 flex-1 text-xs font-semibold leading-5 text-gray-700">{item}</span>
              <span className="flex flex-col gap-1">
                <button onClick={() => moveItem(itemIndex, -1)} disabled={itemIndex === 0} className="rounded-lg bg-gray-50 p-1.5 text-gray-500 disabled:opacity-25" aria-label="向上移动"><ChevronUp size={14} /></button>
                <button onClick={() => moveItem(itemIndex, 1)} disabled={itemIndex === order.length - 1} className="rounded-lg bg-gray-50 p-1.5 text-gray-500 disabled:opacity-25" aria-label="向下移动"><ChevronDown size={14} /></button>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "matrix") {
    const matrix = response.matrix ?? {};
    return (
      <div className="space-y-3">
        {question.rows.map((row, rowIndex) => (
          <div key={row} className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-gray-800">{row}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {question.columns.map((column, columnIndex) => (
                <button key={column} onClick={() => update({ matrix: { ...matrix, [rowIndex]: columnIndex } })} className={`tap min-h-12 rounded-xl px-2 py-2 text-[10px] font-bold leading-4 ${matrix[rowIndex] === columnIndex ? "bg-primary text-white" : "bg-gray-50 text-gray-500"}`}>{column}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (question.type === "file_upload") {
    return (
      <div>
        <input ref={fileInputRef} type="file" accept={question.accept} className="hidden" onChange={event => update({ fileName: event.target.files?.[0]?.name ?? "" })} />
        <button onClick={() => fileInputRef.current?.click()} className="tap w-full rounded-[24px] border-2 border-dashed border-red-200 bg-red-50/60 px-5 py-8 text-center">
          <FileUp size={28} className="mx-auto text-primary" />
          <p className="mt-3 text-sm font-black text-gray-800">{response.fileName ? "已选择文件" : "上传现场截图"}</p>
          <p className="mt-1 break-all text-[11px] text-gray-500">{response.fileName || "支持 PNG、JPG、PDF"}</p>
        </button>
      </div>
    );
  }

  if (question.type === "image_choice") {
    return (
      <>
        <button className="mb-4 block w-full overflow-hidden rounded-[24px] bg-gray-200" aria-label="查看大图"><img src={question.image} alt="快件操作现场" className="h-48 w-full object-cover" /></button>
        <Options options={question.options} value={response.selectedIndex} onChange={selectedIndex => update({ selectedIndex })} />
      </>
    );
  }

  if (question.type === "video_question") {
    return (
      <>
        <div className="mb-4 flex min-h-44 flex-col items-center justify-center rounded-[24px] bg-gray-950 p-5 text-center text-white">
          <Video size={28} className="text-red-400" />
          <p className="mt-3 text-sm font-black">PDA 异常件登记演示</p>
          <p className="mt-1 text-[10px] text-gray-400">已定位 01:35 · 撤销完成</p>
          <button onClick={() => setPlaying(value => !value)} className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary" aria-label={playing ? "暂停视频" : "播放视频"}>{playing ? <span className="h-4 w-4 rounded-sm bg-white" /> : <Play size={19} fill="currentColor" />}</button>
        </div>
        <Options options={question.options} value={response.selectedIndex} onChange={selectedIndex => update({ selectedIndex })} />
      </>
    );
  }

  if (question.type !== "scenario") return null;
  const scenarioIndexes = response.scenarioIndexes ?? [];
  return (
    <div className="space-y-4">
      <div className="rounded-[22px] border border-red-100 bg-red-50 p-4 text-xs leading-6 text-red-900">现场限制：网络正常、包裹在场、操作已写入系统，但撤销按钮显示灰色。</div>
      {question.stages.map((stage, stageIndex) => (
        <div key={stage.prompt} className={`${stageIndex > 0 && scenarioIndexes[0] === undefined ? "pointer-events-none opacity-35" : ""}`}>
          <p className="mb-3 text-xs font-black text-gray-800">{stage.prompt}</p>
          <Options options={stage.options} value={scenarioIndexes[stageIndex]} onChange={selectedIndex => {
            const nextIndexes = [...scenarioIndexes];
            nextIndexes[stageIndex] = selectedIndex;
            update({ scenarioIndexes: nextIndexes });
          }} />
        </div>
      ))}
    </div>
  );
}

function QuestionReview({ answers }: { answers: Answers }) {
  return (
    <section className="mt-4">
      <div className="mb-3 flex items-end justify-between">
        <div><p className="text-[10px] font-bold text-gray-400">答题复盘</p><h2 className="mt-0.5 font-black text-gray-900">逐题解析</h2></div>
        <span className="text-[10px] text-gray-400">共 {questions.length} 题</span>
      </div>
      <div className="space-y-3">
        {questions.map((question, questionIndex) => {
          const correct = isResponseCorrect(question, answers[question.id] ?? {});
          return (
            <details key={question.id} className="card overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4">
                <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${correct ? "bg-green-50 text-green-600" : "bg-red-50 text-primary"}`}>{correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}</span>
                <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold text-gray-400">第 {questionIndex + 1} 题 · {question.title}</span><span className="mt-1 block truncate text-xs font-black text-gray-800">{question.prompt}</span></span>
                <ChevronDown size={16} className="flex-none text-gray-300" />
              </summary>
              <div className="border-t border-gray-100 px-4 py-4 text-[11px] leading-5">
                <ReviewLine label="你的答案" value={formatUserAnswer(question, answers[question.id] ?? {})} tone={correct ? "green" : "red"} />
                <ReviewLine label="正确答案" value={formatCorrectAnswer(question)} tone="green" />
                <div className="mt-3 rounded-2xl bg-gray-50 px-3 py-3 text-gray-600"><strong className="text-gray-800">解析：</strong>{question.explanation}</div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function ReviewLine({ label, value, tone }: { label: string; value: string; tone: "red" | "green" }) {
  return <div className="mb-2"><span className="font-black text-gray-800">{label}：</span><span className={tone === "green" ? "text-green-700" : "text-primary"}>{value}</span></div>;
}

function isAnswered(question: ExamQuestion, response: ExamResponse) {
  if (question.type === "single_choice" || question.type === "image_choice" || question.type === "video_question") return response.selectedIndex !== undefined;
  if (question.type === "multiple_choice") return Boolean(response.selectedIndexes?.length);
  if (question.type === "true_false") return response.booleanValue !== undefined;
  if (question.type === "paragraph" || question.type === "fill_blank") return Boolean(response.text?.trim());
  if (question.type === "dropdown") return response.dropdownIndex !== undefined;
  if (question.type === "sorting") return response.order?.length === question.items.length;
  if (question.type === "matrix") return Object.keys(response.matrix ?? {}).length === question.rows.length;
  if (question.type === "file_upload") return Boolean(response.fileName);
  if (question.type === "scenario") return response.scenarioIndexes?.length === question.stages.length && response.scenarioIndexes.every(value => value !== undefined);
  return false;
}

function isResponseCorrect(question: ExamQuestion, response: ExamResponse) {
  if (question.type === "single_choice" || question.type === "image_choice" || question.type === "video_question") return response.selectedIndex === question.answerIndex;
  if (question.type === "multiple_choice") {
    const selected = [...(response.selectedIndexes ?? [])].sort((first, second) => first - second);
    return selected.length === question.answerIndexes.length && selected.every((value, index) => value === question.answerIndexes[index]);
  }
  if (question.type === "true_false") return response.booleanValue === question.answer;
  if (question.type === "paragraph") return Boolean(response.text?.includes("重新扫描") && response.text.includes("轨迹"));
  if (question.type === "fill_blank") return response.text?.trim().includes("业务轨迹") ?? false;
  if (question.type === "dropdown") return response.dropdownIndex === question.answerIndex;
  if (question.type === "sorting") return response.order?.every((value, index) => value === question.correctOrder[index]) ?? false;
  if (question.type === "matrix") return question.answers.every((value, rowIndex) => response.matrix?.[rowIndex] === value);
  if (question.type === "file_upload") return Boolean(response.fileName);
  if (question.type === "scenario") return question.answerIndexes.every((value, stageIndex) => response.scenarioIndexes?.[stageIndex] === value);
  return false;
}

function formatUserAnswer(question: ExamQuestion, response: ExamResponse) {
  if (question.type === "single_choice" || question.type === "image_choice" || question.type === "video_question") return question.options[response.selectedIndex ?? -1] ?? "未作答";
  if (question.type === "multiple_choice") return response.selectedIndexes?.map(index => question.options[index]).join("、") || "未作答";
  if (question.type === "true_false") return response.booleanValue === undefined ? "未作答" : response.booleanValue ? "正确" : "错误";
  if (question.type === "paragraph" || question.type === "fill_blank") return response.text || "未作答";
  if (question.type === "dropdown") return question.options[response.dropdownIndex ?? -1] ?? "未作答";
  if (question.type === "sorting") return response.order?.join(" → ") || "未作答";
  if (question.type === "matrix") return question.rows.map((row, rowIndex) => `${row}：${question.columns[response.matrix?.[rowIndex] ?? -1] ?? "未选"}`).join("；");
  if (question.type === "file_upload") return response.fileName || "未上传";
  if (question.type === "scenario") return question.stages.map((stage, stageIndex) => `${stageIndex + 1}. ${stage.options[response.scenarioIndexes?.[stageIndex] ?? -1] ?? "未选"}`).join("；");
  return "未作答";
}

function formatCorrectAnswer(question: ExamQuestion) {
  if (question.type === "single_choice" || question.type === "image_choice" || question.type === "video_question" || question.type === "dropdown") return question.options[question.answerIndex];
  if (question.type === "multiple_choice") return question.answerIndexes.map(index => question.options[index]).join("、");
  if (question.type === "true_false") return question.answer ? "正确" : "错误";
  if (question.type === "paragraph" || question.type === "fill_blank" || question.type === "file_upload") return question.correctAnswer;
  if (question.type === "sorting") return question.correctOrder.join(" → ");
  if (question.type === "matrix") return question.rows.map((row, rowIndex) => `${row}：${question.columns[question.answers[rowIndex]]}`).join("；");
  if (question.type === "scenario") return question.stages.map((stage, stageIndex) => `${stageIndex + 1}. ${stage.options[question.answerIndexes[stageIndex]]}`).join("；");
  return "";
}

function ExamMeta({ icon, value }: { icon: ReactNode; value: string }) {
  return <div className="rounded-2xl bg-white/10 px-2 py-3 text-center"><span className="flex justify-center text-red-300">{icon}</span><p className="mt-1.5 text-[10px] font-bold">{value}</p></div>;
}

function Options({ options, value, onChange }: { options: readonly string[]; value?: number; onChange: (value: number) => void }) {
  return (
    <div className="space-y-3">
      {options.map((item, optionIndex) => (
        <button key={item} onClick={() => onChange(optionIndex)} className={`tap flex w-full items-start gap-3 rounded-[22px] border-2 p-4 text-left text-sm font-semibold ${value === optionIndex ? "border-primary bg-red-50 text-primary" : "border-gray-100 bg-white text-gray-700"}`}>
          <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 text-[10px] ${value === optionIndex ? "border-primary bg-primary text-white" : "border-gray-300"}`}>{value === optionIndex ? <Check size={13} /> : optionIndex + 1}</span>{item}
        </button>
      ))}
    </div>
  );
}

function MultiOptions({ options, values, onChange }: { options: readonly string[]; values: number[]; onChange: (values: number[]) => void }) {
  return (
    <div className="space-y-3">
      {options.map((item, optionIndex) => {
        const selected = values.includes(optionIndex);
        return (
          <button key={item} onClick={() => onChange(selected ? values.filter(value => value !== optionIndex) : [...values, optionIndex])} className={`tap flex w-full items-start gap-3 rounded-[22px] border-2 p-4 text-left text-sm font-semibold ${selected ? "border-primary bg-red-50 text-primary" : "border-gray-100 bg-white text-gray-700"}`}>
            <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-lg border-2 text-[10px] ${selected ? "border-primary bg-primary text-white" : "border-gray-300"}`}>{selected && <Check size={13} />}</span>{item}
          </button>
        );
      })}
    </div>
  );
}
