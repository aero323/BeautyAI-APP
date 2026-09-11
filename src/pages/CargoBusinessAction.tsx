import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRightLeft, Check, CheckCircle2, CircleAlert, CloudUpload, LoaderCircle, ScanLine, Smartphone } from "lucide-react";
import { PageHeader, Pill } from "../cargo/components";

const actionNames: Record<string, string> = { scan: "运单扫描", rescan: "PDA 重新扫描", "exception-register": "异常件登记" };

export function CargoBusinessAction() {
  const { code = "scan" } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"ready" | "processing" | "done">("ready");
  const run = () => { setStatus("processing"); window.setTimeout(() => setStatus("done"), 1100); };
  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title={actionNames[code] ?? "业务操作"} subtitle="J&T 快递员 APP · 深链接模拟" />
      <div className="page-x py-5">
        <div className="rounded-[28px] bg-gray-950 p-5 text-white shadow-lg"><div className="flex items-center justify-between"><Pill tone="red">业务页面模拟器</Pill><Smartphone size={22} className="text-gray-400" /></div><h1 className="mt-4 text-xl font-black">{actionNames[code] ?? "业务操作"}</h1><p className="mt-2 text-xs leading-5 text-gray-300">当前原型没有真实 PDA 业务系统，此页面用于演示 AI 答案通过深链接进入业务操作并回传结果。</p></div>
        <div className="card mt-4 p-5">
          {status === "ready" && <><div className="flex min-h-48 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50"><ScanLine size={42} className="text-primary" /><h2 className="mt-4 font-black">运单 JT3049827156</h2><p className="mt-2 text-xs text-gray-400">待撤销 E-SCAN-102 错误节点并重新扫描</p></div><div className="mt-4 space-y-2 text-xs text-gray-600"><p className="flex items-center gap-2"><Check size={15} className="text-green-600" />身份 Token 已映射至工号 JTID07521</p><p className="flex items-center gap-2"><Check size={15} className="text-green-600" />运单状态与 AI 诊断上下文一致</p></div><button onClick={run} className="tap mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black text-white"><ArrowRightLeft size={18} />确认撤销并重新扫描</button></>}
          {status === "processing" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><LoaderCircle size={38} className="animate-spin text-primary" /><h2 className="mt-5 font-black">正在写入正确业务轨迹</h2><p className="mt-2 text-xs text-gray-400">模拟调用 PDA 接口与结果回调</p></div>}
          {status === "done" && <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="flex h-20 w-20 items-center justify-center rounded-[30px] bg-green-50 text-green-600"><CheckCircle2 size={40} /></span><h2 className="mt-5 text-xl font-black">重新扫描成功</h2><p className="mt-2 text-xs leading-5 text-gray-400">正确派件节点已写入，业务事件状态已模拟回传。</p><div className="mt-5 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-xs font-bold text-green-700"><CloudUpload size={16} />回调状态：200 OK</div><button onClick={() => navigate("/plans/plan-pda-001")} className="tap mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-black text-white">查看自动培训计划</button></div>}
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-[22px] bg-amber-50 p-4 text-xs leading-5 text-amber-800"><CircleAlert size={18} className="mt-0.5 flex-none" />生产环境将由真实 J&T APP 处理 SSO、运单接口、操作权限和回调签名。</div>
      </div>
    </div>
  );
}
