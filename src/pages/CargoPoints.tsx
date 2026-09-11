import { Award, CalendarDays, MinusCircle, Star, TrendingUp } from "lucide-react";
import { PageHeader, Pill } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";

export function CargoPoints() {
  const { points, totalPoints } = useCargo();
  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="积分流水" subtitle="奖励与月度结算可追溯" />
      <div className="page-x py-5">
        <div className="rounded-[28px] bg-gray-950 p-6 text-white shadow-lg"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary"><Star size={24} /></span><Pill tone="red">2026年7月</Pill></div><p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">本月可用积分</p><p className="mt-2 text-5xl font-black">{totalPoints}</p><div className="mt-5 grid grid-cols-2 gap-2 text-center"><div className="rounded-2xl bg-white/10 py-3"><p className="text-lg font-black text-green-300">+230</p><p className="mt-1 text-[9px] text-gray-400">本月获得</p></div><div className="rounded-2xl bg-white/10 py-3"><p className="text-lg font-black text-red-300">-10</p><p className="mt-1 text-[9px] text-gray-400">业务扣分</p></div></div></div>
        <div className="mt-4 flex items-center justify-between rounded-[22px] border border-blue-100 bg-blue-50 p-4"><div className="flex items-center gap-3"><CalendarDays size={20} className="text-blue-600" /><div><h3 className="text-sm font-black text-blue-900">月度冻结快照</h3><p className="mt-1 text-[10px] text-blue-700">7月31日 23:59 自动结算</p></div></div><TrendingUp size={20} className="text-blue-500" /></div>
        <div className="card mt-4 p-3"><h2 className="px-2 pb-2 pt-1 font-black">积分明细</h2>{points.map((item, index) => <div key={item.id} className={`flex items-center gap-3 px-2 py-3 ${index > 0 ? "border-t border-gray-100" : ""}`}><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.points > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-primary"}`}>{item.points > 0 ? <Award size={19} /> : <MinusCircle size={19} />}</span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{item.title}</h3><p className="mt-1 text-[10px] text-gray-400">{item.detail} · {item.date}</p></div><strong className={item.points > 0 ? "text-green-600" : "text-primary"}>{item.points > 0 ? "+" : ""}{item.points}</strong></div>)}</div>
      </div>
    </div>
  );
}
