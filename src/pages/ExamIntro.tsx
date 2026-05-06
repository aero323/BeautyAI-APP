import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, FileText, Camera, ShieldAlert } from "lucide-react";

export function ExamIntro() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-56 bg-gradient-to-br from-indigo-500 to-rose-400 rounded-b-[48px] overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-black/10" />
        <button onClick={() => navigate("/")} className="absolute top-10 left-6 p-2 text-white bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="bg-white text-rose-500 text-[10px] px-3 py-1 rounded-full font-bold mb-3 inline-block shadow-sm">New Product</span>
          <h1 className="text-2xl font-black tracking-tight leading-snug">Summer 2024 Product Knowledge Exam</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        {/* Basic Info */}
        <div className="flex justify-between items-center bg-white p-5 rounded-[32px] mb-6 shadow-sm border border-pink-100 relative">
          <div className="flex flex-col items-center flex-1 border-r border-pink-50">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-1"><FileText size={12}/> Questions</span>
            <span className="text-xl font-black text-rose-500">20</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-r border-pink-50">
             <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-1"><Clock size={12}/> Duration</span>
            <span className="text-xl font-black text-indigo-500">30m</span>
          </div>
          <div className="flex flex-col items-center flex-1">
             <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-1"><ShieldAlert size={12}/> Rule</span>
             <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-md mt-1 shadow-sm shadow-red-200">AI Monitor</span>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-red-50 border border-red-100 rounded-[32px] p-6 shadow-[0_4px_20px_rgba(239,68,68,0.05)] relative overflow-hidden">
          <div className="absolute top-[-10px] right-[-10px] text-red-500/10">
            <Camera size={100} />
          </div>
          <h3 className="font-bold text-red-700 text-sm mb-4 flex items-center gap-2 relative z-10">
            <div className="p-1.5 bg-red-100 rounded-full text-red-500">
               <Camera size={16} />
            </div>
            AI Proctoring is ACTIVE
          </h3>
          <ul className="space-y-3 text-[11px] text-red-800/80 font-medium relative z-10">
            <li className="flex items-start gap-2 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0 shadow-[0_0_4px_rgba(248,113,113,0.8)]" />
              Keep your front camera on and ensure your face is fully visible in the center of the frame.
            </li>
            <li className="flex items-start gap-2 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0 shadow-[0_0_4px_rgba(248,113,113,0.8)]" />
              Do not leave the camera view or allow others to enter the frame.
            </li>
            <li className="flex items-start gap-2 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0 shadow-[0_0_4px_rgba(248,113,113,0.8)]" />
              Do not switch to other apps. App switching will be flagged and may void your exam.
            </li>
          </ul>
        </div>
      </div>

      <div className="px-6 py-4 bg-background pb-safe relative z-20">
        <button 
          onClick={() => navigate(`/exam/run/${id}`)}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 rounded-[24px] font-black tracking-wide flex justify-center items-center shadow-lg shadow-rose-200 hover:scale-[1.02] transition-transform"
        >
          Confirm & Start Exam
        </button>
      </div>
    </div>
  );
}
