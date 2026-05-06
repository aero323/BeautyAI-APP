import { UserCircle, Trophy, Clock, Medal, ChevronRight } from "lucide-react";

export function Profile() {
  return (
    <div className="min-h-full bg-background pb-6">
      <div className="bg-primary pt-12 pb-8 px-6 text-white shadow-lg shadow-rose-200 flex flex-col items-center gap-2 rounded-b-[32px] relative z-10 transition-all">
         <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 relative overflow-hidden ring-4 ring-white shadow-sm mt-4">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar" className="w-full h-full object-cover" />
         </div>
        <div className="text-center mt-2">
          <h1 className="text-2xl font-black tracking-tight">Ibu Sarah</h1>
          <p className="text-pink-100 text-[11px] mt-1 bg-black/10 px-3 py-1 rounded-full border border-pink-400">Jakarta Central - Top Beauty Advisor</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="bg-white rounded-[32px] p-5 shadow-sm border border-pink-100 flex-1">
          <h3 className="text-primary font-bold text-lg mb-4">Learning Stats</h3>
          <div className="space-y-4">
            <div className="bg-pink-50 p-3 rounded-2xl flex justify-between items-center">
              <p className="text-xs text-pink-500 font-medium">Total Study Hours</p>
              <p className="text-2xl font-black text-pink-700">128.5 <span className="text-xs font-normal">h</span></p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-2xl flex justify-between items-center">
              <p className="text-xs text-indigo-500 font-medium">AI Roleplay</p>
              <p className="text-2xl font-black text-indigo-700">42 <span className="text-xs font-normal">Times</span></p>
            </div>
          </div>
        </div>

        {/* Leaderboard preview */}
        <section className="bg-white rounded-[32px] shadow-sm border border-pink-100 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800 font-bold text-lg">Leaderboard</h3>
            <span className="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
          
          <div className="space-y-5">
            {[
              { rank: 1, name: "Maria", region: "Jakarta Central", score: 2840, isMe: false },
              { rank: 4, name: "Ibu Sarah", region: "Singapore East", score: 2410, isMe: true },
              { rank: 3, name: "Juliette Tan", region: "Surabaya", score: 2590, isMe: false },
            ].sort((a,b) => a.rank - b.rank).map(user => (
              <div key={user.rank} className={`flex items-center gap-3 ${user.isMe ? 'bg-pink-50 p-2 rounded-xl -mx-2' : ''}`}>
                <span className={`text-lg font-black w-4 ${
                  user.rank === 1 ? 'text-yellow-500' : 
                  user.isMe ? 'text-gray-400' : 'text-gray-300'
                }`}>
                  {user.rank}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden ${
                  user.rank === 1 ? 'bg-yellow-100 border border-yellow-400' : 
                  user.isMe ? 'bg-pink-100 border-2 border-pink-500' : 
                  'bg-gray-200'
                }`}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className={`text-[11px] font-bold ${user.isMe ? 'text-pink-600' : 'text-gray-800'}`}>
                    {user.name} {user.isMe && '(You)'}
                  </p>
                  <p className={`text-[9px] ${user.isMe ? 'text-pink-400' : 'text-gray-400'}`}>{user.region}</p>
                </div>
                <span className={`text-[11px] font-bold ${user.isMe ? 'text-pink-600' : 'text-gray-700'}`}>{user.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
