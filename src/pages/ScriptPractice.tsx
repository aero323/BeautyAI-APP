import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Mic, ArrowLeft, Lightbulb, Settings, Navigation } from "lucide-react";

export function ScriptPractice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const hasHint = searchParams.get("hint") === "true";
  
  const [messages, setMessages] = useState([
    { role: "ai", text: "你好，我想看看有没有适合夏天用的清爽一点的精华。" }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const finishScenario = () => {
    navigate(`/script/result/${id}`);
  };

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setMessages(prev => [...prev, { role: "user", text: "欢迎光临！夏天的确需要清爽不黏腻的精华，您的肤质是偏油还是偏干呢？" }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "ai", 
          text: "我是混合偏干的，但夏天T区比较容易出油。" 
        }]);
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      }, 1000);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* App Bar */}
      <div className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm z-10 border-b border-pink-100/50 pt-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-8">
          <span className="font-bold text-sm tracking-tight text-gray-800">XX精华液场景演练</span>
        </div>
        <button onClick={finishScenario} className="text-[11px] text-indigo-500 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
          Finish
        </button>
      </div>

      {/* Step Header */}
      <div className="flex flex-col items-center py-4 bg-white/40 backdrop-blur-sm border-b border-indigo-50 shadow-[0_4px_20px_rgba(99,102,241,0.03)] relative z-10">
        <div className="flex items-center gap-2 mb-2">
           <Navigation size={14} className="text-indigo-500" />
           <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step {currentStep} / {totalSteps}</span>
        </div>
        <h2 className="font-black text-gray-800 text-sm">{currentStep === 1 ? "① 开场问候与需求了解" : "② 挖掘痛点与痛点确认"}</h2>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 z-10 pb-24">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm overflow-hidden border border-indigo-100 bg-white">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Customer" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`p-4 text-sm shadow-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-gradient-to-br from-indigo-500 to-indigo-400 text-white rounded-[24px] rounded-tr-[8px] shadow-indigo-200 font-medium" 
                : "bg-white text-gray-800 rounded-[24px] rounded-tl-[8px] border border-pink-50"
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hints & Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(99,102,241,0.06)] z-20 pb-safe">
        {hasHint && messages[messages.length-1]?.role === "ai" && (
          <div className="px-6 py-4 bg-indigo-50/50 rounded-t-[32px] border-b border-indigo-50/30">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                <span className="font-bold text-indigo-600 mr-1">💡 关键词：</span>肤质类型 / 使用习惯 / 期望效果
              </p>
            </div>
          </div>
        )}
        
        <div className="p-6 flex flex-col items-center justify-center gap-5">
          <button 
            onMouseDown={handleRecord}
            onMouseUp={() => setIsRecording(false)}
            onTouchStart={handleRecord}
            onTouchEnd={() => setIsRecording(false)}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform border-[6px] border-white z-10 relative ${
              isRecording 
                ? "bg-red-500 scale-105 shadow-red-200" 
                : "bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-indigo-200 hover:scale-105"
            }`}
          >
            <Mic size={32} className="text-white mb-1" />
          </button>
          
          <div className="flex w-full justify-between items-center px-4 mt-2">
             <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mx-auto">
              {isRecording ? "Release Send" : "Hold to Reply"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
