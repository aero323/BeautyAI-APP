import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";

export function ExamList() {
  const navigate = useNavigate();
  const { regionData, missions } = useMockAuth();
  if (!regionData) return null;
  const exams = regionData.exams.map((exam) => {
    const examMission = missions.find(mission => mission.type === "exam" && mission.sourceId === exam.id);
    const status = examMission?.status === "done" ? "completed" : exam.status;
    return { ...exam, status };
  });
  const availableExams = exams.filter((exam) => exam.status === "pending");
  const endedExams = exams.filter((exam) => exam.status !== "pending");

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 py-6 pb-8 bg-white rounded-b-[48px] shadow-sm z-10 relative overflow-hidden border-b border-pink-100">
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-8 relative z-10">Online Exams</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-pink-50 pb-2 mb-4">Available Exams</h3>

        {availableExams.map((exam) =>
          renderExamCard(exam, () => navigate(`/exam/intro/${exam.id}`))
        )}

        {endedExams.length > 0 && (
          <div className="pt-3">
            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-pink-100" />
              <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em]">已结束考试</span>
              <div className="h-px flex-1 bg-pink-100" />
            </div>
          </div>
        )}

        {endedExams.map((exam) => renderExamCard(exam))}
      </div>
    </div>
  );
}

function renderExamCard(
  exam: {
  id: number;
  title: string;
  status: "pending" | "completed" | "missed";
  questions: number;
  time: string;
  date: string;
  score?: number;
},
  onOpen?: () => void
) {
  return (
    <div
      key={exam.id}
      onClick={exam.status === "pending" ? onOpen : undefined}
      className={`bg-white rounded-[32px] p-5 shadow-sm border transition-all ${
        exam.status === "pending"
          ? "border-pink-100 hover:shadow-md hover:border-pink-200 cursor-pointer"
          : "border-gray-100 opacity-75 grayscale-[0.2]"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-gray-800 text-[15px] leading-snug flex-1 pr-4">{exam.title}</h4>
        {exam.status === "completed" && (
          <span className="bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-sm border border-green-100 flex items-center gap-1"><CheckCircle2 size={12} />{exam.score ?? 85} Pts</span>
        )}
        {exam.status === "missed" && (
          <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-sm border border-gray-200 flex items-center gap-1"><AlertTriangle size={12} />Missed</span>
        )}
      </div>

      <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium mt-4 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-50">
        <span className="flex items-center gap-1"><BookOpen size={14} className="text-indigo-400" /> {exam.questions} Qs</span>
        <span className="flex items-center gap-1"><Clock size={14} className="text-orange-400" /> {exam.time}</span>
        <span className="ml-auto text-gray-400">{exam.date}</span>
      </div>

      {exam.status === "pending" && (
        <div className="mt-4">
          <button className="w-full h-14 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-black rounded-[20px] shadow-lg shadow-rose-200 transition-transform hover:scale-[1.01]">
            <Play size={16} className="fill-white" /> Start
          </button>
        </div>
      )}
    </div>
  );
}
