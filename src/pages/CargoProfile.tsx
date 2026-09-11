import { useNavigate } from "react-router-dom";
import { Building2, LogOut, RotateCcw, Star, Trophy } from "lucide-react";
import { ListLink, Pill } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import { rankingData } from "../cargo/data";

export function CargoProfile() {
  const navigate = useNavigate();
  const { user, logout, resetDemo } = useCargo();
  const departmentRanking = rankingData.department.slice(0, 3);
  if (!user) return null;
  return (
    <div className="min-h-full bg-background pb-6">
      <header className="rounded-b-[34px] bg-gray-950 px-5 pb-7 pt-12 text-white">
        <div className="flex items-center gap-4"><img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-[22px] border-2 border-white/20 bg-white/10 object-cover" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="text-xl font-black">{user.name}</h1><Pill tone="red">{user.role}</Pill></div><p className="mt-1 text-xs text-gray-400">工号 {user.employeeNo}</p><p className="mt-1 truncate text-[10px] text-gray-500">{user.station}</p></div></div>
      </header>

      <div className="page-x space-y-4 py-5">
        <div className="card p-3">
          <ListLink icon={<Building2 size={19} />} title="组织与身份" subtitle={`${user.department} · ${user.region}`} trailing={<Pill tone="green">权限正常</Pill>} />
          <div className="mx-3 border-t border-gray-100" />
          <ListLink icon={<Star size={19} />} title="积分流水" subtitle="奖励、扣分和月度结算记录" onClick={() => navigate("/points")} />
        </div>

        <section className="card p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2"><Trophy size={19} className="text-primary" /><h2 className="font-black text-gray-900">部门排行榜</h2></div>
              <p className="mt-1 text-[10px] text-gray-400">{user.department} · 本月积分</p>
            </div>
            <button onClick={() => navigate("/rankings?scope=department")} className="tap rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-primary">查看全部</button>
          </div>
          <div className="space-y-3">
            {departmentRanking.map(item => (
              <div key={item.rank} className={`flex items-center gap-3 rounded-2xl ${item.isMe ? "border border-red-100 bg-red-50 p-3" : "px-3 py-2"}`}>
                <span className={`w-5 text-center text-sm font-black ${item.rank === 1 ? "text-amber-500" : item.isMe ? "text-primary" : "text-gray-300"}`}>{item.rank}</span>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt={item.name} className="h-9 w-9 flex-none rounded-xl bg-gray-100 object-cover" />
                <div className="min-w-0 flex-1"><p className={`truncate text-xs font-black ${item.isMe ? "text-primary" : "text-gray-800"}`}>{item.name}{item.isMe ? " · 我" : ""}</p><p className="mt-0.5 truncate text-[9px] text-gray-400">{item.org}</p></div>
                <span className={`text-xs font-black ${item.isMe ? "text-primary" : "text-gray-700"}`}>{item.points}</span>
              </div>
            ))}
          </div>
        </section>

        <button onClick={resetDemo} className="tap flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-xs font-black text-gray-600"><RotateCcw size={16} />重置主演示进度</button>
        <button onClick={() => { logout(); navigate("/"); }} className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 py-3.5 text-xs font-black text-white"><LogOut size={16} />退出模拟身份</button>
      </div>
    </div>
  );
}
