import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, ChevronRight, FileText, Play } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";

export function AIPractice() {
  const [activeTab, setActiveTab] = useState<"roleplay" | "scenario" | "sentence">("roleplay");
  const [expandedSentenceLines, setExpandedSentenceLines] = useState<Set<string>>(new Set());
  const [activeSentenceCategory, setActiveSentenceCategory] = useState<string>("全部");
  const { user, regionData } = useMockAuth();
  if (!user || !regionData) return null;
  const sentenceCatalog = useMemo(() => groupSentenceCatalog(regionData.sentences), [regionData.sentences]);
  const sentenceCategories = useMemo(() => ["全部", ...new Set(regionData.sentences.map(item => item.category))], [regionData.sentences]);
  const filteredSentenceCatalog = activeSentenceCategory === "全部"
    ? sentenceCatalog
    : sentenceCatalog.filter(category => category.name === activeSentenceCategory);

  const toggleSentenceLine = (lineKey: string) => {
    setExpandedSentenceLines(prev => {
      const next = new Set(prev);
      if (next.has(lineKey)) {
        next.delete(lineKey);
      } else {
        next.add(lineKey);
      }
      return next;
    });
  };

  return (
    <div className="min-h-full bg-background pb-6">
      <div className="bg-white px-6 py-4 shadow-[0_4px_20px_rgba(244,63,94,0.05)] sticky top-0 z-10 rounded-b-3xl border-b border-pink-100 flex flex-col items-center">
        <h1 className="text-xl font-black text-gray-800 tracking-tight mb-4 mt-2">All Practice</h1>
        <p className="text-sm font-medium text-gray-500 mb-4">除了任务之外，你可以在这里自由练习</p>
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
            {regionData.personas.map(persona => {
              const isIndigo = persona.color === "indigo";
              return (
                <div key={persona.id} className={`overflow-hidden bg-white rounded-[28px] shadow-sm border ${isIndigo ? 'border-indigo-100' : 'border-rose-100'}`}>
                  <div className={`relative h-52 overflow-hidden ${isIndigo ? 'bg-gradient-to-br from-indigo-200 via-sky-100 to-white' : 'bg-gradient-to-br from-rose-200 via-orange-100 to-white'}`}>
                    <img
                      src={persona.portraitImage ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${persona.avatarSeed}`}
                      alt={persona.customerName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute left-4 right-4 bottom-4">
                      <h3 className="text-lg font-black text-white tracking-tight">{persona.customerName}</h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {persona.tags.map(tag => (
                        <span
                          key={tag}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${isIndigo ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400">角色简介</p>
                        <p className="mt-1 text-[13px] leading-6 text-gray-700">{persona.description}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link to={`/practice/chat/${persona.id}`} className={`w-full h-14 text-white text-sm rounded-2xl font-black flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] ${isIndigo ? 'bg-indigo-500 shadow-indigo-200' : 'bg-rose-500 shadow-rose-200'}`}>
                        <Play size={18} fill="currentColor" /> 开始对练
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {activeTab === "scenario" && (
          <div className="space-y-4">
            {regionData.scenarios.map(scenario => (
              <div key={scenario.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-pink-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-rose-500 flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-800 text-sm leading-snug">{scenario.title}</h3>
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
          <div className="space-y-5">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {sentenceCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveSentenceCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold border transition-colors ${
                    activeSentenceCategory === category
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-pink-100 hover:bg-pink-50 hover:text-rose-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {filteredSentenceCatalog.map(category => (
                <section key={category.name} className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.28em] text-gray-400 uppercase">
                    <div className="h-px flex-1 bg-pink-100" />
                    <span>{category.name}</span>
                    <div className="h-px flex-1 bg-pink-100" />
                  </div>

                  <div className="space-y-3">
                    {category.lines.map(line => {
                      const lineKey = `${category.name}:${line.name}`;
                      const isExpanded = expandedSentenceLines.has(lineKey);
                      const firstProduct = line.products[0];
                      return (
                        <div key={lineKey} className="overflow-hidden rounded-[28px] bg-white border border-pink-100 shadow-sm">
                          <button
                            onClick={() => toggleSentenceLine(lineKey)}
                            className="w-full p-4 flex items-center gap-4 text-left"
                          >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-rose-50 shrink-0">
                              <img
                                src={firstProduct.productImage}
                                alt={firstProduct.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                                  {line.products.length} 个产品
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                  {firstProduct.scope}
                                </span>
                              </div>
                              <h4 className="font-black text-gray-800 text-sm leading-snug truncate">{line.name}</h4>
                              <p className="text-[12px] text-gray-500 mt-1 leading-5 line-clamp-2">{firstProduct.productDescription}</p>
                            </div>
                            {isExpanded ? <ChevronDown size={18} className="text-gray-400 shrink-0" /> : <ChevronRight size={18} className="text-gray-400 shrink-0" />}
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-pink-50">
                              {line.products.map(product => (
                                <Link
                                  key={product.id}
                                  to={`/reading?sentenceId=${product.id}`}
                                  className="block rounded-[24px] border border-gray-100 bg-rose-50/35 overflow-hidden"
                                >
                                  <div className="grid grid-cols-[88px_1fr] gap-3 p-3">
                                    <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden shrink-0">
                                      <img src={product.productImage} alt={product.productName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex flex-col justify-between">
                                      <div className="space-y-2">
                                        <div className="flex flex-wrap gap-1.5">
                                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-500 border border-rose-100">
                                            {product.scope}
                                          </span>
                                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-500 border border-indigo-100">
                                            {product.tagline}
                                          </span>
                                        </div>
                                        <h5 className="text-sm font-black text-gray-800 leading-snug">{product.productName}</h5>
                                        <p className="text-[12px] leading-5 text-gray-600 line-clamp-3">{product.quote}</p>
                                      </div>

                                      <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="text-[10px] leading-4 text-gray-400 line-clamp-2">{product.hint}</span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-500 shrink-0">
                                          开始练习 <Play size={12} fill="currentColor" />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function groupSentenceCatalog(sentences: Array<{
  category: string;
  line: string;
  productName: string;
  productDescription: string;
  productImage: string;
  quote: string;
  hint: string;
  scope: string;
  tagline: string;
}>) {
  const categoryMap = new Map<string, Map<string, typeof sentences>>();
  for (const sentence of sentences) {
    if (!categoryMap.has(sentence.category)) {
      categoryMap.set(sentence.category, new Map());
    }
    const lineMap = categoryMap.get(sentence.category)!;
    if (!lineMap.has(sentence.line)) {
      lineMap.set(sentence.line, []);
    }
    lineMap.get(sentence.line)!.push(sentence);
  }

  return Array.from(categoryMap.entries()).map(([name, lineMap]) => ({
    name,
    lines: Array.from(lineMap.entries()).map(([lineName, products]) => ({
      name: lineName,
      products
    }))
  }));
}
