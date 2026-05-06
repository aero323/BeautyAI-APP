import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Play, User as UserIcon, FileText } from "lucide-react";

export function AIPractice() {
  const [activeTab, setActiveTab] = useState<"roleplay" | "scenario" | "sentence">("roleplay");

  const personas = [
    {
      id: 1,
      name: "敏感肌咨询 (Ibu Sarah, 35岁)",
      focus: "肤质诊断、成分讲解、安抚",
      maxScore: 78,
      practiceCount: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      description: "顾客皮肤敏感经常泛红，曾使用竞品出现不良反应，对新产品比较谨慎。",
      color: "indigo"
    },
    {
      id: 2,
      name: "抗初老需求 (Mbak Rini, 28岁)",
      focus: "挖掘潜在需求、痛点放大、连带推荐",
      maxScore: 92,
      practiceCount: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Erik",
      description: "顾客想寻找能改善细纹的产品，预算有限，希望立竿见影的效果。",
      color: "rose"
    }
  ];

  const scenarios = [
    {
      id: 1,
      title: "XX精华液「黄金六步推荐法」",
      maxScore: 72,
      practiceCount: 3,
    }
  ]

  return (
    <div className="min-h-full bg-background pb-6">
      <div className="bg-white px-6 py-4 shadow-[0_4px_20px_rgba(244,63,94,0.05)] sticky top-0 z-10 rounded-b-3xl border-b border-pink-100 flex flex-col items-center">
        <h1 className="text-xl font-black text-gray-800 tracking-tight mb-4 mt-2">Practice</h1>
        <div className="flex bg-gray-100/80 p-1 rounded-2xl w-full max-w-[320px]">
          <button 
            onClick={() => setActiveTab("roleplay")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "roleplay" ? "bg-white text-rose-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Roleplay
          </button>
          <button 
            onClick={() => setActiveTab("scenario")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "scenario" ? "bg-white text-rose-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Scenario
          </button>
          <button 
            onClick={() => setActiveTab("sentence")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "sentence" ? "bg-white text-rose-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sentence
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5 flex-1">
        {activeTab === "roleplay" && (
          <>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {["全部", "护肤咨询", "彩妆试色", "投诉异议"].map((cat, i) => (
                 <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold border transition-colors ${
                   i === 0 
                     ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-200' 
                     : 'bg-white text-gray-600 border-pink-100 hover:bg-pink-50 hover:text-rose-500'
                 }`}>
                   {cat}
                 </button>
              ))}
            </div>

            {personas.map(persona => {
              const isIndigo = persona.color === "indigo";
              return (
                <div key={persona.id} className={`bg-white rounded-[24px] p-5 shadow-sm border ${isIndigo ? 'border-indigo-100' : 'border-rose-100'}`}>
                  <div className="flex gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 flex-shrink-0 ${isIndigo ? 'bg-indigo-50 border-indigo-200' : 'bg-rose-50 border-rose-200'}`}>
                      <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-black text-sm ${isIndigo ? 'text-indigo-800' : 'text-rose-800'}`}>{persona.name}</h3>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{persona.description}</p>
                      <div className={`mt-2 text-[10px] px-2 py-1 rounded-md inline-block font-bold ${isIndigo ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                        重点：{persona.focus}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="text-[11px] text-gray-500 flex items-center gap-4">
                      <span>最高分: <span className="font-black text-gray-700 text-sm">{persona.maxScore}</span></span>
                      <span>已练: {persona.practiceCount}次</span>
                    </div>
                    <Link to={`/practice/chat/${persona.id}`} className={`text-white text-[11px] px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 ${isIndigo ? 'bg-indigo-500 shadow-indigo-200' : 'bg-rose-500 shadow-rose-200'}`}>
                      <Play size={14} fill="currentColor" /> 开始对练
                    </Link>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {activeTab === "scenario" && (
          <div className="space-y-4">
            {scenarios.map(scenario => (
              <div key={scenario.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-pink-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-rose-500 flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-800 text-sm leading-snug">{scenario.title}</h3>
                    <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-4">
                      <span>最高分：<span className="font-bold text-gray-700 text-sm">{scenario.maxScore}</span></span>
                      <span>已练习：{scenario.practiceCount}次</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Link 
                    to={`/script/${scenario.id}?hint=true`}
                    className="bg-pink-50 border border-pink-100 text-rose-600 py-2.5 rounded-xl text-xs font-bold text-center hover:bg-pink-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    [有提示] 引导模式
                  </Link>
                  <Link 
                    to={`/script/${scenario.id}?hint=false`}
                    className="bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-bold text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    [无提示] 挑战模式
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sentence" && (
          <div className="space-y-4">
             <div className="bg-white rounded-[24px] p-5 shadow-sm border border-pink-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-800 text-base leading-snug">Daily Sentences</h3>
                    <p className="text-xs text-gray-500 mt-1">Core product vocabulary & key phrases</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link 
                    to="/reading"
                    className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-3.5 w-full rounded-xl text-sm font-bold text-center transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5 shadow-md shadow-rose-200"
                  >
                    Start Practice
                  </Link>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
