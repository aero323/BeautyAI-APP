import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

export function ExamResult() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      <div className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm z-10 sticky top-0 border-b border-pink-100/50 pt-10">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-800 flex-1 text-center pr-8 tracking-tight">Exam Results</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Score Header */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden border border-pink-100">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-12 -translate-y-12"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-50 rounded-full -translate-x-10 translate-y-10"></div>
          
          <div className="relative z-10">
            <div className={`w-32 h-32 rounded-[32px] border-8 flex items-center justify-center rotate-3 border-indigo-50 bg-white shadow-sm`}>
              <div className="-rotate-3 flex flex-col items-center">
                 <span className={`text-5xl font-black text-indigo-500 tracking-tighter`}>85</span>
              </div>
            </div>
          </div>
          
          <h2 className="font-black text-gray-800 mt-8 text-2xl relative z-10">Excellent! 🏆</h2>
          <div className="flex gap-4 mt-4 relative z-10">
            <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">Time: <span className="text-gray-800">22:15</span></span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 flex items-center gap-1">
              <CheckCircle size={12} /> Passed
            </span>
          </div>
           <div className="flex items-center gap-1 mt-4 text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 z-10 relative">
             <CheckCircle size={12} />
             AI Proctoring: No Issues
           </div>
        </div>

        {/* Answer Breakdown */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100">
          <h3 className="font-bold text-gray-800 border-b border-pink-50 pb-3 mb-4">Question Breakdown <span className="text-gray-500 text-xs font-medium ml-2">(17/20)</span></h3>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({length: 20}).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square rounded-2xl flex items-center justify-center text-xs font-bold shadow-sm",
                  i === 3 || i === 7 || i === 12 
                    ? "bg-red-50 text-red-500 border border-red-100" 
                    : "bg-green-50 text-green-600 border border-green-100"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Incorrect Explanations */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 px-2 flex items-center gap-2">
            <XCircle className="text-red-500" size={18} />
            Incorrect Answers Review
          </h3>
          
          <div className="bg-red-50/50 rounded-[32px] p-6 shadow-sm border border-red-100">
             <div className="flex items-start gap-3 mb-3">
               <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-bold mt-0.5 shadow-sm border border-red-200">Q4</span>
               <p className="text-[13px] font-bold text-gray-800 leading-snug">关于新款精华液的连带销售，下列说法错误的是？</p>
             </div>
             
             <div className="space-y-2 mt-4 text-[11px] font-medium bg-white p-4 rounded-2xl border border-red-50">
               <p className="text-red-500 flex items-start gap-2">
                 <XCircle size={14} className="mt-0.5 flex-shrink-0"/> 
                 <span><span className="font-bold">Your Answer:</span> C. 可以与任何A醇类产品叠加使用</span>
               </p>
               <p className="text-green-600 flex items-start gap-2 pt-2 border-t border-gray-50">
                 <CheckCircle size={14} className="mt-0.5 flex-shrink-0"/> 
                 <span><span className="font-bold">Correct:</span> B. 直接推荐最高浓度的维C产品</span>
               </p>
             </div>
             
             <div className="mt-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900/80 leading-relaxed">
               <span className="font-bold text-indigo-600 block mb-1">Explanation:</span>
               新款精华的连带销售需要根据顾客肌肤耐受度决定，不能盲目推荐最高浓度维C。
             </div>
           </div>
        </div>

        <button onClick={() => navigate("/")} className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 rounded-[24px] font-black shadow-lg shadow-rose-200 mt-6 hover:scale-[1.02] transition-transform">
          Back to Home
        </button>
      </div>
    </div>
  );
}
