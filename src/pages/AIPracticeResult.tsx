import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, Star, Lightbulb } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";
import { getPracticeUnitId } from "../data/mockData";

export function AIPracticeResult() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const { user, regionData, recordCompletion } = useMockAuth();
  const persona = regionData?.personas.find(item => String(item.id) === id) ?? regionData?.personas[0];
  useEffect(() => {
    if (persona) {
      recordCompletion("practice", undefined, getPracticeUnitId("persona", persona.id));
    }
  }, [recordCompletion, persona]);
  if (!user || !persona) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      <div className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm z-10 sticky top-0 border-b border-pink-100/50 pt-10">
        <button onClick={() => navigate("/practice")} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-800 flex-1 text-center pr-8 tracking-tight">Report</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Score Header */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center text-center border border-pink-100">
          <div className="w-32 h-32 rounded-full border-8 border-pink-50 flex items-center justify-center relative shadow-inner">
            <span className="text-5xl font-black text-rose-500 tracking-tighter">82</span>
            <div className="absolute -bottom-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md">Overall Score</div>
          </div>
          <h2 className="font-black text-gray-800 mt-8 text-xl">Great Job, {user.greetingName}! 🎉</h2>
          <p className="text-[11px] text-gray-400 mt-2 font-medium">{persona.name}</p>
        </div>

        {/* Dimensions */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100 space-y-5">
          <h3 className="font-bold text-gray-800 border-b border-pink-50 pb-3 flex items-center justify-between">
            Performance Breakdown
            <span className="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">New</span>
          </h3>
          
          <ScoreBar label="Product Knowledge" score={85} color="bg-rose-500" />
          <ScoreBar label="Fluency" score={75} color="bg-indigo-400" />
          <ScoreBar label="Needs Discovery" score={82} color="bg-rose-400" />
          <ScoreBar label="Objection Handling" score={92} color="bg-indigo-500" icon={<Star size={14} className="text-yellow-500" />} />
          <ScoreBar label="Cross-selling" score={65} color="bg-orange-400" icon={<AlertTriangle size={14} className="text-orange-500" />} />
        </div>

        {/* Suggestions */}
        <div className="bg-indigo-50 rounded-[32px] p-6 shadow-sm border border-indigo-100 space-y-4">
          <h3 className="font-bold text-indigo-800 border-b border-indigo-200 pb-3 flex items-center gap-2">
            <Lightbulb className="text-indigo-500 w-5 h-5" />
            Areas for Improvement
          </h3>
          <ul className="space-y-4 text-[13px] text-indigo-900 list-decimal pl-5 marker:font-bold marker:text-indigo-400">
            <li className="pl-2 leading-relaxed">
              连带推荐环节可主动推荐配套的保湿霜，增强成套销售机会。
            </li>
            <li className="pl-2 leading-relaxed">
              <span className="font-bold text-indigo-600 mb-1 block">Suggested Phrasing:</span>
              <span className="italic block mt-1 bg-white/50 p-2 rounded-lg border border-indigo-100">"搭配XX保湿霜效果更好，因为敏感肌需要强化屏障修护..."</span>
            </li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="mt-4">
          <button onClick={() => navigate(-1)} className="py-4 bg-white border border-pink-200 text-rose-600 rounded-[20px] font-bold text-sm flex justify-center items-center gap-2 shadow-sm transition-colors hover:bg-rose-50">
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, icon, color = 'bg-rose-500' }: { label: string, score: number, icon?: ReactNode, color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-2 font-bold">
        <span className="text-gray-600 flex items-center gap-1.5">{label} {icon}</span>
        <span className="text-gray-800">{score}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${color}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  )
}
