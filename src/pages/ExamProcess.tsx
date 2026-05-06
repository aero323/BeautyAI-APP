import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Camera, AlertTriangle } from "lucide-react";

export function ExamProcess() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const totalQuestions = 20;

  // Mock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      navigate(`/exam/result/${id}`);
    }
  };

  const handlePrev = () => {
     if (currentQuestion > 1) {
       setCurrentQuestion(prev => prev - 1);
       setSelectedAnswer(null);
     }
  }

  const options = ["3% 烟酰胺，4周内提亮", "5% 烟酰胺，2周内提亮", "10% 烟酰胺，1周内提亮", "2% 烟酰胺，8周内提亮"];

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
       {/* Abstract background */}
       <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-xl px-6 py-4 pt-10 shadow-sm sticky top-0 flex items-center justify-between z-10 border-b border-pink-100/50">
        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold font-mono border border-red-100 shadow-sm">
          <Clock size={14} />
          {formatTime(timeLeft)}
        </div>
        
        <div className="text-[11px] font-black text-gray-800 tracking-widest uppercase">
          Question {currentQuestion} / {totalQuestions}
        </div>

        <div className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100 font-bold shadow-sm">
          <Camera size={12} />
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_4px_rgba(99,102,241,0.6)]"></span>
            Proctoring
          </span>
        </div>
      </div>

      {/* Warning popup mock */}
      {currentQuestion === 3 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] w-full p-8 flex flex-col items-center text-center max-w-sm bounce-in shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-4 bg-red-500"></div>
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 mt-4 ring-4 ring-red-50 shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">App Switch Detected</h2>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium mb-8">You left the exam screen. This has been recorded. Switching apps 3 times will automatically fail your exam. Please return immediately.</p>
            <button onClick={() => setCurrentQuestion(4)} className="w-full bg-gradient-to-r from-red-500 to-rose-400 text-white py-4 rounded-[20px] font-black shadow-lg shadow-red-200 hover:scale-[1.02] transition-transform">
              Acknowledge & Return
            </button>
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 p-6 relative z-10 flex flex-col">
        {/* Progress Dots */}
        <div className="flex gap-1.5 mb-6 justify-center">
            {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full ${idx === 0 ? 'bg-indigo-500 w-4' : 'bg-indigo-100 w-1.5'}`} />
            ))}
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100 flex flex-col flex-1">
          <div className="mb-6 border-b border-pink-50 pb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border border-indigo-100 shadow-sm">Single Choice</span>
              <span className="text-gray-400 text-[10px] font-bold">Topic: Ingredients</span>
            </div>
            <h2 className="text-lg font-black text-gray-800 leading-snug">
              新款烟酰胺美白精华的核心成分浓度是多少？它在什么时间内可以达到明显的提亮效果？
            </h2>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {options.map((opt, i) => {
               const isSelected = selectedAnswer === i;
               return (
                 <label key={i} className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                   isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-pink-50 hover:bg-pink-50 hover:border-pink-200'
                 }`}>
                   <input type="radio" name="q" className="hidden" checked={isSelected} onChange={() => setSelectedAnswer(i)} />
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 mt-0.5 ${
                      isSelected ? 'border-primary bg-primary/10' : 'border-gray-200'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                   <span className={`text-[13px] font-medium leading-relaxed ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{opt}</span>
                 </label>
               )
            })}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-pink-50 shadow-[0_-8px_30px_rgba(244,63,94,0.06)] pb-safe flex gap-3 relative z-10 w-full">
        <button 
          onClick={handlePrev}
          disabled={currentQuestion === 1}
          className="flex-[0.4] py-4 bg-gray-50 border border-gray-200 text-gray-600 rounded-[20px] font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors shadow-sm"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          className="flex-[0.6] bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 rounded-[20px] font-black shadow-lg shadow-rose-200 hover:scale-[1.02] transition-transform"
        >
          {currentQuestion === totalQuestions ? "Submit Exam" : "Next Question"}
        </button>
      </div>
    </div>
  );
}
