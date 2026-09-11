import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export function PageHeader({ title, subtitle, right, back = true }: { title: string; subtitle?: string; right?: ReactNode; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-5 pb-4 pt-safe backdrop-blur-xl">
      <div className="flex min-h-11 items-center gap-3">
        {back && (
          <button onClick={() => navigate(-1)} className="tap -ml-2 flex h-10 w-10 items-center justify-center rounded-2xl text-gray-600 hover:bg-gray-50">
            <ArrowLeft size={21} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-black text-gray-900">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-[11px] font-medium text-gray-400">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-black text-gray-900">{title}</h2>
      {action}
    </div>
  );
}

export function ProgressBar({ value, color = "bg-primary" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Pill({ children, tone = "gray" }: { children: ReactNode; tone?: "red" | "green" | "amber" | "blue" | "gray" }) {
  const toneClass = {
    red: "bg-red-50 text-primary",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    gray: "bg-gray-100 text-gray-600"
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold", toneClass)}>{children}</span>;
}

export function ListLink({ icon, title, subtitle, onClick, trailing }: { icon: ReactNode; title: string; subtitle?: string; onClick?: () => void; trailing?: ReactNode }) {
  return (
    <button onClick={onClick} className="tap flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-gray-50">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-gray-900">{title}</span>
        {subtitle && <span className="mt-0.5 block truncate text-[11px] text-gray-400">{subtitle}</span>}
      </span>
      {trailing ?? <ChevronRight size={17} className="text-gray-300" />}
    </button>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card flex flex-col items-center px-8 py-10 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">{icon}</span>
      <h3 className="font-black text-gray-900">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-gray-400">{text}</p>
    </div>
  );
}
