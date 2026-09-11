import { Link, useParams } from "react-router-dom";
import { Bot, CircleAlert, FileText, ShieldAlert } from "lucide-react";
import { PageHeader } from "../cargo/components";
import { businessEvents } from "../cargo/data";

const adviceSteps = [
  "立即停止当前运单的后续扫描，先核对包裹实物、运单号与最新业务轨迹。",
  "从 PDA 扫描记录进入最近一次操作，撤销错误节点，原因选择“节点选择错误”。",
  "重新选择正确的派件节点完成扫描，并确认成功提示及最新业务轨迹已更新。"
];

export function CargoEventDetail() {
  const { id = "event-pda-001" } = useParams();
  const event = businessEvents.find(item => item.id === id) ?? businessEvents[0];

  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="异常详情" subtitle={`${event.time} · 系统自动识别`} />
      <div className="page-x py-5">
        <div className="rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-primary text-white"><CircleAlert size={24} /></span>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-black text-gray-950">{event.title}</h1>
              <p className="mt-2 text-xs leading-6 text-gray-600">{event.summary}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-semibold text-gray-500">
            <span className="rounded-xl bg-white/80 px-3 py-2.5">运单号<br /><strong className="mt-1 block text-gray-800">{event.waybill}</strong></span>
            <span className="rounded-xl bg-white/80 px-3 py-2.5">错误码<br /><strong className="mt-1 block text-gray-800">{event.errorCode}</strong></span>
          </div>
        </div>

        <section className="card mt-4 p-5">
          <div className="flex items-center gap-2"><ShieldAlert size={18} className="text-primary" /><h2 className="font-black text-gray-900">异常描述</h2></div>
          <p className="mt-3 text-xs leading-6 text-gray-600">系统检测到运单 {event.waybill} 在派件扫描时误选为“问题件”，但包裹仍在派送员现场，当前扫描节点与运单任务状态不一致。</p>
          <div className="mt-4 divide-y divide-gray-100 rounded-[20px] bg-gray-50 px-4">
            <DetailRow label="异常类型" value="派件节点错扫" />
            <DetailRow label="错误节点" value="问题件" />
            <DetailRow label="应选节点" value="派件" />
            <DetailRow label="影响判断" value="继续操作可能产生错误业务轨迹" emphasize />
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[26px] border border-red-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-red-100 bg-red-50/70 px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white"><Bot size={20} /></span>
            <h2 className="text-sm font-black text-gray-900">AI 处置建议</h2>
          </div>
          <div className="p-5">
            <p className="text-xs leading-6 text-gray-600">建议先纠正错误业务轨迹，再恢复正常派件操作。请按以下顺序完成处置：</p>
            <ol className="mt-4 space-y-4">
              {adviceSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-red-50 text-[10px] font-black text-primary">{index + 1}</span>
                  <span className="text-xs leading-5 text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
            <Link to="/knowledge/doc-scan-sop?location=page-12" className="tap mt-5 flex items-start gap-2 border-t border-gray-100 pt-4 text-[10px] leading-5 text-gray-400">
              <FileText size={14} className="mt-0.5 flex-none text-primary" />
              <span><strong className="font-bold text-gray-500">引用依据：</strong>《PDA 扫描异常处理 SOP》V3.2 · 第 12 页 · 错扫处理</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailRow({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return <div className="flex items-start justify-between gap-4 py-3 text-[11px]"><span className="flex-none text-gray-400">{label}</span><strong className={`text-right leading-5 ${emphasize ? "text-primary" : "text-gray-700"}`}>{value}</strong></div>;
}
