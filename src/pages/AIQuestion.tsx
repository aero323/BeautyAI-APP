import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Search, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AIQuestion() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello Sarah! Ask me anything about our products, ingredients, or brand knowledge. I'm here to help you assist customers better.", source: null }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const bottomRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Skincare", "Makeup", "Fragrance", "Body", "Ingredients"];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg, source: null }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "For sensitive skin looking to brighten, I highly recommend the Centella Brightening Serum.\n\n✨ Key Ingredients: \n- 5% Niacinamide (Brightens)\n- Centella Asiatica (Soothes redness)\n\n💬 Selling Point: \n'It's specially formulated for sensitive skin. It brightens without irritation because the Centella calms your skin at the same time.'\n\nIs there a specific customer concern you are dealing with right now?", 
        source: "Source: Product Manual v2.4 (Page 12)" 
      }]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
       <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm z-10 sticky top-0 border-b border-pink-100/50 pt-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 px-4 text-center">
           <h1 className="text-xl font-black text-gray-800 tracking-tight pr-8">Knowledge Base</h1>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6 py-4 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(244,63,94,0.03)] border-b border-pink-50 relative z-10">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold border transition-colors ${
              category === c 
                ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-200" 
                : "bg-white text-gray-600 border-pink-100 hover:bg-pink-50 hover:text-rose-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 z-10">
         {/* Suggestion Bubbles (Empty State) */}
         {messages.length === 1 && (
            <div className="mb-8 pt-4">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-4">Suggested Queries</p>
               <div className="flex flex-wrap gap-2 justify-center">
                  <span className="bg-white border border-pink-100 text-rose-500 text-[11px] px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-pink-50 transition-colors">"Alternatives to Retinol?"</span>
                  <span className="bg-white border border-indigo-100 text-indigo-500 text-[11px] px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors">"New Summer Collection details"</span>
               </div>
            </div>
         )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm overflow-hidden border border-indigo-100 bg-white p-1">
                   <Lightbulb className="w-full h-full text-indigo-500" />
                </div>
            )}
            <div className={`p-4 text-[13px] shadow-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white rounded-[24px] rounded-tr-[8px] shadow-rose-200 font-medium" 
                : "bg-white text-gray-800 rounded-[24px] rounded-tl-[8px] border border-indigo-50"
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.source && (
                 <div className="mt-3 text-[9px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-md inline-block border border-gray-100 shadow-sm">
                   {msg.source}
                 </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[85%]">
             <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm overflow-hidden border border-indigo-100 bg-white p-1">
               <Lightbulb className="w-full h-full text-indigo-500 opacity-50" />
            </div>
            <div className="bg-white border border-indigo-50 shadow-sm rounded-[24px] rounded-tl-[8px] p-4 flex gap-1 items-center">
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-pink-50 shadow-[0_-8px_30px_rgba(244,63,94,0.06)] pb-safe relative z-10">
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ingredients, products..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-[20px] pl-5 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all font-medium placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-2xl flex flex-col justify-center items-center disabled:opacity-50 transition-transform shadow-sm hover:scale-105 ${!input.trim() || loading ? 'opacity-50' : ''}`}
          >
            <Send size={16} className="-ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
