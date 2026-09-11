import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Route, ShieldAlert } from "lucide-react";

export function CargoPracticeHub() {
  return (
    <div className="min-h-full bg-background">
      <header className="bg-white px-5 pb-5 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Scenario Practice</p>
        <h1 className="mt-1 text-2xl font-black text-gray-950">练习</h1>
        <p className="mt-2 text-xs leading-5 text-gray-500">在真实业务分支中练习 SOP 处理步骤。</p>
      </header>

      <div className="page-x py-5">
        <div className="space-y-3">
          <ScenarioCard to="/practice/sign-failure" icon={<Route size={20} />} title="签收失败处理" subtitle="联系留痕 · 复派预约 · 异常登记" />
          <ScenarioCard to="/practice/refuse-delivery" icon={<ShieldAlert size={20} />} title="客户拒收处理" subtitle="原因核实 · 证据留存 · 退件审批" />
        </div>
      </div>
    </div>
  );
}

function ScenarioCard({ to, icon, title, subtitle }: { to: string; icon: ReactNode; title: string; subtitle: string }) {
  return (
    <Link to={to} className="tap card flex items-center gap-3 p-4">
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary">{icon}</span>
      <span className="min-w-0 flex-1">
        <strong className="mb-1 block text-sm text-gray-900">{title}</strong>
        <span className="block truncate text-[11px] text-gray-500">{subtitle}</span>
      </span>
      <ChevronRight size={18} className="text-gray-300" />
    </Link>
  );
}
