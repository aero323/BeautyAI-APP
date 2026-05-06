import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Mic, ArrowLeft, Lightbulb, Settings } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";

export function AIPracticeChat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const { regionData } = useMockAuth();
  const persona = regionData?.personas.find(item => String(item.id) === id) ?? regionData?.personas[0];
  
  const [messages, setMessages] = useState([
    { role: "ai", text: persona?.firstMessage ?? "" }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(true);
  if (!persona) return null;
  
  const endChat = () => {
    navigate(`/practice/result/${id}${missionId ? `?missionId=${missionId}` : ""}`);
  };

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setMessages(prev => [...prev, { role: "user", text: persona.sampleReply }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "ai", 
          text: persona.followUpMessage
        }]);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* App Bar */}
      <div className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm z-10 border-b border-pink-100/50 pt-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-8">
          <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shadow-sm">{persona.sceneLabel}</span>
        </div>
        <button onClick={endChat} className="text-[11px] text-rose-500 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
          Finish
        </button>
      </div>

      {/* Persona Header */}
      <div className="flex flex-col items-center py-5 bg-white/40 backdrop-blur-sm border-b border-rose-100 shadow-sm relative z-10">
        <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-rose-50">
           <img src={persona.portraitImage ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${persona.avatarSeed}`} alt="AI" className="w-full h-full object-cover" />
        </div>
        <h2 className="font-black text-gray-800 mt-2 text-sm tracking-tight">{persona.customerName}, {persona.age}y</h2>
        <div className="text-[10px] font-bold text-gray-500 mt-1 flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.6)]"></span>
          Listening
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm overflow-hidden border border-rose-100 bg-white">
                 <img src={persona.portraitImage ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${persona.avatarSeed}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`p-4 text-sm shadow-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white rounded-[24px] rounded-tr-[8px] shadow-rose-200 font-medium" 
                : "bg-white text-gray-800 rounded-[24px] rounded-tl-[8px] border border-pink-50"
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hints & Actions */}
      <div className="bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(244,63,94,0.06)] pb-safe relative z-10 border-t border-pink-50">
        {showHint && messages[messages.length-1]?.role === "ai" && (
          <div className="px-6 py-4 border-b border-pink-50 bg-rose-50/50 rounded-t-[32px]">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-600 leading-relaxed">
                <span className="font-bold text-rose-600 mr-1">Hint:</span>{persona.hint}
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
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform border-[6px] border-white ${
              isRecording 
                ? "bg-red-500 scale-105 shadow-red-200" 
                : "bg-gradient-to-r from-pink-500 to-rose-400 shadow-rose-200 hover:scale-105"
            }`}
          >
            <Mic size={32} className="text-white mb-1" />
          </button>
          
          <div className="flex w-full justify-between items-center px-2">
            <button 
              onClick={() => setShowHint(!showHint)} 
              className={`flex items-center gap-1.5 text-[11px] font-bold ${showHint ? 'text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full' : 'text-gray-400'}`}
            >
              <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
              {isRecording ? "Release Send" : "Hold to Speak"}
            </span>
            <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              <Settings size={14} /> Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
