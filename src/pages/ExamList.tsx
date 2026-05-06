import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, ChevronRight, CheckCircle2, AlertTriangle, Play } from "lucide-react";

export function ExamList() {
  const navigate = useNavigate();

  const exams = [
    { id: 1, title: "夏季防晒新品知识考核", status: "pending", questions: 20, time: "30分钟", date: "截止: 2024-06-30" },
    { id: 2, title: "王牌抗老精华核心卖点考核", status: "completed", score: 95, questions: 20, time: "15分钟", date: "2024-05-15" },
    { id: 3, title: "敏感肌护理基础理论", status: "missed", questions: 10, time: "10分钟", date: "截止: 2024-05-01" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 py-6 pb-8 bg-white rounded-b-[48px] shadow-sm z-10 relative overflow-hidden border-b border-pink-100">
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-8 relative z-10">Online Exams</h1>
        <p className="text-[13px] text-gray-500 font-medium mt-1 relative z-10">Assess your product knowledge.</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-pink-50 pb-2 mb-4">Available Exams</h3>

        {exams.map((exam) => (
          <div 
            key={exam.id} 
            onClick={() => exam.status === "pending" ? navigate(`/exam/intro/${exam.id}`) : null}
            className={`bg-white rounded-[32px] p-5 shadow-sm border transition-all ${
              exam.status === "pending" 
                ? "border-pink-100 hover:shadow-md hover:border-pink-200 cursor-pointer" 
                : "border-gray-100 opacity-75 grayscale-[0.2]"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-gray-800 text-[15px] leading-snug flex-1 pr-4">{exam.title}</h4>
              {exam.status === "pending" && (
                 <span className="bg-rose-50 text-rose-500 text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-sm border border-rose-100 uppercase tracking-wide">Pending</span>
              )}
              {exam.status === "completed" && (
                 <span className="bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-sm border border-green-100 flex items-center gap-1"><CheckCircle2 size={12}/>{exam.score} Pts</span>
              )}
               {exam.status === "missed" && (
                 <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-sm border border-gray-200 flex items-center gap-1"><AlertTriangle size={12}/>Missed</span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium mt-4 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-50">
              <span className="flex items-center gap-1"><BookOpen size={14} className="text-indigo-400" /> {exam.questions} Qs</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-orange-400" /> {exam.time}</span>
              <span className="ml-auto text-gray-400">{exam.date}</span>
            </div>

            {exam.status === "pending" && (
               <div className="mt-4 flex justify-end">
                   <button className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[11px] font-bold px-4 py-2 rounded-[16px] shadow-sm shadow-rose-200 transition-transform hover:scale-105">
                       <Play size={12} className="fill-white" /> Start
                   </button>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
