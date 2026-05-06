import { Link } from "react-router-dom";
import { Bell, ChevronRight, PlayCircle, BookCheck, ClipboardList, Flame, MessageSquare } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col min-h-full bg-background pb-6">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-white rounded-b-[32px] shadow-sm border-b border-pink-100 relative z-10 pt-10">
        <div>
          <p className="text-gray-400 text-xs">Good Morning,</p>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Ibu Sarah ✨</h2>
        </div>
        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 relative overflow-hidden ring-4 ring-white shadow-sm">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar" className="w-full h-full object-cover" />
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        
        {/* Quick AI Entry */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-5 text-white shadow-lg shadow-rose-200">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-sm">AI Knowledge Assistant</p>
            <span className="bg-white/20 px-2 py-1 rounded-full text-[10px] font-bold">Online</span>
          </div>
          <p className="text-xs opacity-90 mb-4 italic">"Ask me anything about the New Glow Serum..."</p>
          <Link to="/qa" className="w-full bg-white text-rose-500 font-bold py-2.5 rounded-xl text-xs flex justify-center items-center">
            Start Chatting
          </Link>
        </div>

        {/* Daily Missions (Homework) */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-gray-800">Daily Missions</h3>
            <span className="text-[10px] text-pink-500 font-bold underline cursor-pointer">View All</span>
          </div>
          <div className="bg-white border border-pink-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
              <ClipboardList size={22} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-700 leading-tight mb-1">Sensitivity Skincare Quiz</p>
              <p className="text-[10px] text-gray-400">Ends in: <span className="text-rose-500 font-bold">2h 45m</span></p>
            </div>
            <Link to="/exam/intro/1" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-gray-200 transition-colors">Start</Link>
          </div>
        </section>

        {/* Practice Modes */}
        <section>
          <h3 className="font-bold text-gray-800 mb-3">AI Roleplay</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/practice" className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 bg-white rounded-full mb-3 flex items-center justify-center border-2 border-indigo-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="AI" className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] font-bold text-indigo-700 text-center leading-tight">Sarah (35y)</p>
              <p className="text-[9px] text-indigo-400 mb-3">Sensitive Skin</p>
              <div className="bg-indigo-600 text-white text-[10px] w-full py-2 rounded-xl font-bold flex justify-center items-center">Practice</div>
            </Link>
            
            <Link to="/script/1" className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 bg-white rounded-full mb-3 flex items-center justify-center border-2 border-rose-200 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Erik" alt="AI" className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] font-bold text-rose-700 text-center leading-tight">Gift Selection</p>
              <p className="text-[9px] text-rose-400 mb-3">High Spending</p>
              <div className="bg-rose-600 text-white text-[10px] w-full py-2 rounded-xl font-bold flex justify-center items-center">Practice</div>
            </Link>
          </div>
        </section>

        {/* Recommended Daily Reading */}
        <section>
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-pink-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-bold italic">Sentence of Day</span>
            </div>
            <p className="text-sm text-gray-700 mb-4 font-medium italic underline decoration-pink-200 underline-offset-4 mt-8">
              "This serum contains 5% Niacinamide which helps brighten skin in 2 weeks..."
            </p>
            <div className="flex items-center gap-3">
              <Link to="/reading" className="w-10 h-10 bg-gray-50 rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-primary hover:bg-pink-50 transition-colors">
                <PlayCircle size={20} fill="currentColor" />
              </Link>
              <p className="text-[11px] text-gray-500 font-medium">Follow and read <br/><span className="text-[9px] text-gray-400 font-normal">123 BAs practiced</span></p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}


