import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, CalendarClock, Crown, Map, Medal, Trophy } from "lucide-react";
import { PageHeader, Pill } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import { rankingData } from "../cargo/data";

type Scope = "department" | "region" | "national";

export function CargoRankings() {
  const { user } = useCargo();
  const [params, setParams] = useSearchParams();
  const scope = (params.get("scope") ?? "department") as Scope;
  const rows = rankingData[scope].map(row => {
    if (!row.isMe || !user) return row;
    return scope === "department"
      ? { ...row, name: user.name, org: user.department }
      : { ...row, name: user.department, org: user.region };
  });
  const tabs: { id: Scope; label: string; icon: ReactNode }[] = [{ id: "department", label: "部门", icon: <Building2 size={14} /> }, { id: "region", label: "区域", icon: <Map size={14} /> }, { id: "national", label: "全国", icon: <Trophy size={14} /> }];
  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="积分排行榜" subtitle="同一积分流水 · 多维 PK" />
      <div className="page-x py-5">
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-gray-200 p-1">{tabs.map(tab => <button key={tab.id} onClick={() => setParams({ scope: tab.id })} className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black ${scope === tab.id ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}>{tab.icon}{tab.label}</button>)}</div>
        <div className="mt-4 rounded-[28px] bg-gray-950 p-5 text-white"><div className="flex items-center justify-between"><div><p className="text-[10px] text-gray-400">我的当前排名</p><p className="mt-1 text-3xl font-black">第 2 名</p></div><span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary"><Crown size={27} /></span></div><div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-xs"><span>距离第 1 名</span><strong className="text-red-300">还差 58 分</strong></div></div>
        <div className="card mt-4 overflow-hidden p-3">{rows.map(row => <div key={`${row.rank}-${row.name}`} className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${row.isMe ? "bg-red-50" : ""}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl font-black ${row.rank === 1 ? "bg-amber-100 text-amber-700" : row.rank === 2 ? "bg-gray-200 text-gray-700" : "bg-orange-50 text-orange-700"}`}>{row.rank <= 3 ? <Medal size={18} /> : row.rank}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-black">{row.name}</h3>{row.isMe && <Pill tone="red">我</Pill>}</div><p className="mt-1 text-[10px] text-gray-400">{row.org}</p></div><strong className="text-sm">{row.points}</strong></div>)}</div>
        <button className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-xs font-black text-gray-600"><CalendarClock size={16} />查看历史结算榜单</button>
      </div>
    </div>
  );
}
