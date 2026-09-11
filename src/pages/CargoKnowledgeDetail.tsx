import type { ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Bookmark, CalendarClock, CheckCircle2, FileText, Layers3, LockKeyhole, Share2 } from "lucide-react";
import { PageHeader, Pill } from "../cargo/components";
import { knowledgeDocuments } from "../cargo/data";

export function CargoKnowledgeDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const doc = knowledgeDocuments.find(item => item.id === id) ?? knowledgeDocuments[0];
  const location = params.get("location") ?? doc.location;
  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="知识详情" subtitle="企业知识中心同步内容" right={<button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500"><Share2 size={17} /></button>} />
      <div className="page-x py-5">
        <div className="card p-5">
          <div className="flex flex-wrap gap-2"><Pill tone="red">{doc.category}</Pill><Pill>{doc.format}</Pill><Pill tone="green"><CheckCircle2 size={11} className="mr-1" />有效</Pill></div>
          <h1 className="mt-4 text-xl font-black leading-tight text-gray-950">{doc.title}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">{doc.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
            <Meta icon={<Layers3 size={14} />} label={`版本 ${doc.version}`} />
            <Meta icon={<CalendarClock size={14} />} label={`有效至 ${doc.validUntil}`} />
            <Meta icon={<FileText size={14} />} label={doc.source} />
            <Meta icon={<LockKeyhole size={14} />} label={doc.permission} />
          </div>
        </div>

        <div className="mt-4 rounded-[26px] border-2 border-red-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><Pill tone="red">AI 引用定位</Pill><span className="text-[10px] font-bold text-primary">{location}</span></div>
          <h2 className="font-black">3.2 派件节点错扫处理</h2>
          <div className="mt-4 space-y-3 text-xs leading-6 text-gray-600">
            <p><strong className="text-gray-900">① 停止操作：</strong>发现节点选择错误后，不得继续生成后续扫描轨迹。</p>
            <p><strong className="text-gray-900">② 核对信息：</strong>确认运单号、当前任务、包裹实物与系统最新状态一致。</p>
            <p><strong className="text-gray-900">③ 撤销重扫：</strong>在最近操作记录中撤销错扫，选择正确节点重新完成扫描。</p>
            <p><strong className="text-gray-900">④ 异常升级：</strong>无法撤销时登记异常件，上传现场照片并通知网点负责人。</p>
          </div>
        </div>

        <button className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-black text-gray-700"><Bookmark size={17} />收藏到常用 SOP</button>
      </div>
    </div>
  );
}

function Meta({ icon, label }: { icon: ReactNode; label: string }) { return <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5"><span className="text-primary">{icon}</span><span className="truncate">{label}</span></div>; }
