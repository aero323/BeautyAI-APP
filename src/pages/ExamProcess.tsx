import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Upload
} from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";
import type { ExamItem, ExamQuestion } from "../data/mockData";

type ExamResponseState = {
  selectedIndex?: number | null;
  selectedIndexes?: number[];
  booleanValue?: boolean | null;
  text?: string;
  dropdownIndex?: number | null;
  order?: string[];
  matrix?: Record<string, boolean>;
  fileName?: string;
};

const QUESTION_TYPE_LABELS: Record<ExamQuestion["type"], string> = {
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  paragraph: "Paragraph",
  dropdown: "Dropdown",
  sorting: "Sorting",
  matrix: "Checkbox Matrix",
  file_upload: "File Upload"
};

function createLegacyQuestion(exam: ExamItem): ExamQuestion {
  return {
    id: `legacy-${exam.id}`,
    type: "single_choice",
    topic: exam.topic,
    prompt: exam.question ?? exam.title,
    options: exam.options ?? ["选项 A", "选项 B"],
    answerIndex: exam.answerIndex ?? 0
  };
}

export function ExamProcess() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { regionData } = useMockAuth();
  const exam = regionData?.exams.find(item => String(item.id) === id) ?? regionData?.exams[0];
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const questionItems = useMemo(() => {
    if (!exam) return [];
    return exam.items?.length ? exam.items : [createLegacyQuestion(exam)];
  }, [exam]);

  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ExamResponseState>>({});

  if (!exam || questionItems.length === 0) return null;

  const totalQuestions = questionItems.length;
  const currentQuestion = questionItems[currentQuestionIndex] ?? questionItems[0];
  const currentResponse = responses[currentQuestion.id] ?? {};

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const updateResponse = (questionId: string, patch: Partial<ExamResponseState>) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? {}),
        ...patch
      }
    }));
  };

  const moveSortingItem = (question: Extract<ExamQuestion, { type: "sorting" }>, index: number, direction: -1 | 1) => {
    const currentOrder = currentResponse.order ?? [...question.items];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const nextOrder = [...currentOrder];
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    updateResponse(question.id, { order: nextOrder });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      navigate(`/exam/result/${id}`);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderQuestionBody = (question: ExamQuestion) => {
    const response = responses[question.id] ?? {};

    switch (question.type) {
      case "single_choice":
        return (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {question.options.map((opt, index) => {
              const isSelected = response.selectedIndex === index;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateResponse(question.id, { selectedIndex: index })}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-pink-50 hover:bg-pink-50 hover:border-pink-200"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 mt-0.5 ${
                    isSelected ? "border-primary bg-primary/10" : "border-gray-200"
                  }`}>
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                  <span className={`text-[13px] font-medium leading-relaxed ${isSelected ? "text-primary" : "text-gray-700"}`}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {question.options.map((opt, index) => {
              const selectedIndexes = response.selectedIndexes ?? [];
              const isSelected = selectedIndexes.includes(index);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const nextIndexes = isSelected
                      ? selectedIndexes.filter(item => item !== index)
                      : [...selectedIndexes, index];
                    updateResponse(question.id, { selectedIndexes: nextIndexes });
                  }}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-rose-400 bg-rose-50/70 shadow-sm"
                      : "border-pink-50 hover:bg-pink-50 hover:border-pink-200"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 mt-0.5 ${
                    isSelected ? "border-rose-400 bg-rose-500 text-white" : "border-gray-200"
                  }`}>
                    {isSelected && <Check size={12} />}
                  </span>
                  <span className={`text-[13px] font-medium leading-relaxed ${isSelected ? "text-rose-600" : "text-gray-700"}`}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case "true_false":
        return (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { label: "True", value: true },
              { label: "False", value: false }
            ].map(option => {
              const isSelected = response.booleanValue === option.value;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => updateResponse(question.id, { booleanValue: option.value })}
                  className={`min-h-28 rounded-[24px] border-2 p-4 flex items-center justify-center text-center transition-all ${
                    isSelected
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-pink-50 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <span className="font-black text-base tracking-wide">{option.label}</span>
                </button>
              );
            })}
          </div>
        );

      case "paragraph":
        return (
          <div className="space-y-3 flex-1">
            <textarea
              value={response.text ?? ""}
              onChange={e => updateResponse(question.id, { text: e.target.value })}
              placeholder={question.placeholder ?? "请输入答案"}
              className="w-full min-h-56 resize-none rounded-[24px] border-2 border-pink-100 bg-white px-4 py-4 text-[13px] leading-relaxed text-gray-700 outline-none transition-colors focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>{response.text?.length ?? 0} Characters</span>
              <span>Free Text</span>
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div className="space-y-4 flex-1">
            <div className="rounded-[24px] border-2 border-pink-100 bg-white px-4 py-4 shadow-sm">
              <select
                value={response.dropdownIndex ?? ""}
                onChange={e => updateResponse(question.id, { dropdownIndex: Number(e.target.value) })}
                className="w-full bg-transparent text-[13px] font-medium text-gray-800 outline-none"
              >
                <option value="" disabled>
                  请选择一个答案
                </option>
                {question.options.map((opt, index) => (
                  <option key={opt} value={index}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">下拉选择题适合用于单一最佳答案的场景。</p>
          </div>
        );

      case "sorting": {
        const order = response.order ?? [...question.items];
        return (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {order.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[20px] border border-pink-100 bg-white p-4 shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-black text-indigo-600">
                  {index + 1}
                </div>
                <div className="flex-1 text-[13px] font-medium leading-relaxed text-gray-700">{item}</div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveSortingItem(question, index, -1)}
                    disabled={index === 0}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-1.5 text-gray-500 transition-colors disabled:opacity-30"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSortingItem(question, index, 1)}
                    disabled={index === order.length - 1}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-1.5 text-gray-500 transition-colors disabled:opacity-30"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "matrix": {
        const matrix = response.matrix ?? {};
        return (
          <div className="space-y-3 flex-1 overflow-x-auto">
            <div
              className="grid gap-2 min-w-[540px]"
              style={{
                gridTemplateColumns: `minmax(140px, 1.4fr) repeat(${question.columns.length}, minmax(84px, 1fr))`
              }}
            >
              <div />
              {question.columns.map(column => (
                <div key={column} className="rounded-xl bg-indigo-50 px-3 py-2 text-center text-[11px] font-bold text-indigo-700">
                  {column}
                </div>
              ))}

              {question.rows.map((row, rowIndex) => (
                <div key={row} className="contents">
                  <div className="flex items-center rounded-xl bg-gray-50 px-3 py-3 text-[12px] font-medium text-gray-700">
                    {row}
                  </div>
                  {question.columns.map((column, columnIndex) => {
                    const cellKey = `${rowIndex}:${columnIndex}`;
                    const isSelected = Boolean(matrix[cellKey]);
                    return (
                      <button
                        key={column}
                        type="button"
                        onClick={() => {
                          const nextMatrix = { ...matrix };
                          nextMatrix[cellKey] = !isSelected;
                          updateResponse(question.id, { matrix: nextMatrix });
                        }}
                        className={`flex min-h-14 items-center justify-center rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-rose-400 bg-rose-50 text-rose-600"
                            : "border-pink-100 bg-white text-gray-300 hover:border-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        {isSelected ? <Check size={16} /> : <span className="h-3 w-3 rounded-sm border-2 border-current" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "file_upload":
        return (
          <div className="space-y-4 flex-1">
            <input
              ref={node => {
                fileInputRefs.current[question.id] = node;
              }}
              type="file"
              accept={question.accept}
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                updateResponse(question.id, { fileName: file?.name ?? "" });
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRefs.current[question.id]?.click()}
              className="w-full rounded-[24px] border-2 border-dashed border-pink-200 bg-pink-50/40 px-6 py-8 text-left transition-colors hover:border-rose-300 hover:bg-rose-50/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
                  <Upload size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-black text-gray-800">点击上传文件</p>
                  <p className="mt-1 text-[11px] font-medium text-gray-500">
                    {response.fileName ? `已选择：${response.fileName}` : "支持 PDF、PNG、JPG"}
                  </p>
                </div>
              </div>
            </button>
            <p className="text-[11px] text-gray-400 font-medium">
              上传题用于模拟作业提交或培训记录留档。
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background relative">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pink-100/50 bg-white/80 px-6 py-4 pt-10 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600 shadow-sm">
          <Clock size={14} />
          {formatTime(timeLeft)}
        </div>

        <div className="text-[11px] font-black tracking-widest text-gray-800 uppercase">
          Question {currentQuestionIndex + 1} / {totalQuestions}
        </div>

        <div className="flex items-center gap-1 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600 shadow-sm">
          <Camera size={12} />
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.6)] animate-pulse" />
            Proctoring
          </span>
        </div>
      </div>

      {currentQuestionIndex === 2 && totalQuestions > 3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
          <div className="bounce-in relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-4 bg-red-500" />
            <div className="mb-6 mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-inner ring-4 ring-red-50">
              <AlertTriangle size={32} />
            </div>
            <h2 className="mb-2 text-xl font-black text-gray-800">App Switch Detected</h2>
            <p className="mb-8 text-[13px] leading-relaxed text-gray-500 font-medium">
              You left the exam screen. This has been recorded. Switching apps 3 times will automatically fail your exam. Please return immediately.
            </p>
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions - 1))}
              className="w-full rounded-[20px] bg-gradient-to-r from-red-500 to-rose-400 py-4 font-black text-white shadow-lg shadow-red-200 transition-transform hover:scale-[1.02]"
            >
              Acknowledge & Return
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col p-6">
        <div className="mb-6 flex justify-center gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentQuestionIndex ? "w-4 bg-indigo-500" : "w-1.5 bg-indigo-100"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col rounded-[32px] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 border-b border-pink-50 pb-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm">
                {QUESTION_TYPE_LABELS[currentQuestion.type]}
              </span>
              <span className="text-[10px] font-bold text-gray-400">Topic: {currentQuestion.topic}</span>
            </div>
            <h2 className="text-lg font-black leading-snug text-gray-800">{currentQuestion.prompt}</h2>
            {currentQuestion.helperText && (
              <p className="mt-3 text-[11px] font-medium leading-relaxed text-gray-500">{currentQuestion.helperText}</p>
            )}
          </div>

          {renderQuestionBody(currentQuestion)}
        </div>
      </div>

      <div className="relative z-10 flex w-full gap-3 border-t border-pink-50 bg-white p-6 pb-safe shadow-[0_-8px_30px_rgba(244,63,94,0.06)]">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="flex-[0.4] rounded-[20px] border border-gray-200 bg-gray-50 py-4 font-bold text-gray-600 shadow-sm transition-colors hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-[0.6] rounded-[20px] bg-gradient-to-r from-pink-500 to-rose-400 py-4 font-black text-white shadow-lg shadow-rose-200 transition-transform hover:scale-[1.02]"
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Submit Exam" : "Next Question"}
        </button>
      </div>
    </div>
  );
}
