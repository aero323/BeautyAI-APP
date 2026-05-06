import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";
import { getPracticeUnitId } from "../data/mockData";

export function ScriptPracticeResult() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const { recordCompletion } = useMockAuth();

  useEffect(() => {
    if (id) {
      recordCompletion("practice", undefined, getPracticeUnitId("scenario", Number(id)));
    }
  }, [id, recordCompletion]);

  const steps = [
    { name: "①开场问候", score: 92, warning: false },
    { name: "②了解需求", score: 78, warning: false },
    { name: "③产品推荐", score: 85, warning: false },
    { name: "④成分讲解", score: 68, warning: true },
    { name: "⑤异议处理", score: 83, warning: false },
    { name: "⑥促成交易", score: 90, warning: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      <div className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm z-10 sticky top-0 border-b border-pink-100/50 pt-10">
        <button onClick={() => navigate("/practice")} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-800 flex-1 text-center pr-8 tracking-tight">剧本完成报告</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Total Score */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center text-center border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-indigo-100/50 rounded-full blur-2xl"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">整体匹配度</span>
          
          <div className="w-32 h-32 rounded-full border-8 border-indigo-50 flex items-center justify-center relative shadow-inner z-10">
             <span className="text-5xl font-black text-indigo-500 tracking-tighter">81<span className="text-xl">%</span></span>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-indigo-100 space-y-5">
          <h3 className="font-bold text-gray-800 border-b border-indigo-50 pb-3 mb-4">各步骤得分</h3>
          
          <div className="space-y-4">
            {steps.map(step => (
              <div key={step.name} className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] text-gray-700">
                  <span className="flex items-center gap-1 font-bold">
                    {step.name} 
                    {step.warning && <span className="text-orange-500">⚠️</span>}
                  </span>
                  <span className="font-bold text-gray-800">{step.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${step.warning ? 'bg-orange-400' : 'bg-gradient-to-r from-indigo-500 to-indigo-400'}`} 
                    style={{ width: `${step.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl mt-6 shadow-sm">
            <h4 className="text-orange-600 font-bold text-[11px] mb-2 flex items-center gap-1.5 uppercase tracking-widest">
              <AlertTriangle size={14} /> ⚠️ 步骤④建议参考：
            </h4>
            <p className="text-gray-700 text-xs leading-relaxed bg-white/80 p-3 rounded-xl border border-orange-50">
              "精华液含有5%烟酰胺+透明质酸，烟酰胺能帮助提亮肤色，透明质酸深层保湿..."
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (missionId) {
              navigate(`/tasks/practice/${missionId}`);
              return;
            }
            navigate("/practice");
          }}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-[20px] font-bold shadow-md shadow-indigo-200 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} /> 再次挑战
        </button>
      </div>
    </div>
  );
}
