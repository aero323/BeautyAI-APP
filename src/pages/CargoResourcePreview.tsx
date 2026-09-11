import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, FileSpreadsheet, FileText, Globe2, Maximize2, Pause, Play, Presentation, Share2 } from "lucide-react";
import { PageHeader, Pill, ProgressBar } from "../cargo/components";
import { learningCategoryLabels, learningFormatLabels, learningResources, type LearningFormat, type LearningResource } from "../cargo/learningResources";

export function CargoResourcePreview() {
  const { id } = useParams();
  const resource = learningResources.find(item => item.id === id) ?? learningResources[0];
  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title="资料预览" subtitle={`${learningFormatLabels[resource.format]} · 应用内打开`} right={<button className="tap flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500" aria-label="分享"><Share2 size={17} /></button>} />
      <div className="page-x py-5">
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary"><FormatIcon format={resource.format} /></span>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap gap-1.5"><Pill tone="red">{learningFormatLabels[resource.format]}</Pill><Pill>{learningCategoryLabels[resource.category]}</Pill></div><h1 className="mt-3 text-lg font-black leading-tight text-gray-950">{resource.title}</h1><p className="mt-2 text-[11px] leading-5 text-gray-500">{resource.version} · {resource.source} · {resource.updatedAt}</p></div>
          </div>
        </div>

        <div className="mt-4">
          {resource.format === "WORD" && <WordPreview resource={resource} />}
          {resource.format === "PDF" && <PdfPreview resource={resource} />}
          {resource.format === "PPT" && <PptPreview resource={resource} />}
          {resource.format === "EXCEL" && <ExcelPreview />}
          {resource.format === "WEB" && <WebPreview resource={resource} />}
          {resource.format === "VIDEO" && <VideoPreview resource={resource} />}
        </div>
      </div>
    </div>
  );
}

function WordPreview({ resource }: { resource: LearningResource }) {
  return (
    <PreviewFrame label="Word 文档" pages="1 / 8">
      <div className="bg-gray-100 p-3">
        <article className="min-h-[430px] bg-white px-6 py-7 shadow-sm">
          <p className="text-center text-[9px] font-bold tracking-[0.18em] text-gray-400">J&T CARGO INTERNAL DOCUMENT</p>
          <h2 className="mt-5 text-center text-lg font-black text-gray-950">{resource.title}</h2>
          <p className="mt-2 text-center text-[10px] text-gray-400">{resource.version} · 内部发布</p>
          <div className="mt-7 space-y-4 text-[11px] leading-6 text-gray-700">
            <p><strong className="text-gray-950">一、适用范围</strong><br />本文件适用于网点收派员、操作员及相关业务管理人员。</p>
            <p><strong className="text-gray-950">二、操作要求</strong><br />扫描前应核对运单、包裹实物与当前任务节点，发现异常时立即停止后续操作。</p>
            <p><strong className="text-gray-950">三、异常处理</strong><br />按规范保留现场信息，通过对应业务入口完成登记并关注处理结果回传。</p>
          </div>
        </article>
      </div>
    </PreviewFrame>
  );
}

function PdfPreview({ resource }: { resource: LearningResource }) {
  const [page, setPage] = useState(1);
  return (
    <div className="overflow-hidden rounded-[24px] bg-gray-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 text-[10px] font-bold text-gray-300"><span>PDF 阅读器</span><div className="flex items-center gap-3"><button onClick={() => setPage(value => Math.max(1, value - 1))} aria-label="上一页"><ChevronLeft size={16} /></button><span>{page} / 12</span><button onClick={() => setPage(value => Math.min(12, value + 1))} aria-label="下一页"><ChevronRight size={16} /></button></div></div>
      <div className="bg-gray-200 p-3">
        <article className="min-h-[430px] bg-white px-6 py-7 shadow-sm">
          <div className="border-b-2 border-primary pb-4"><p className="text-[9px] font-black text-primary">运营管理中心</p><h2 className="mt-2 text-xl font-black leading-tight text-gray-950">{resource.title}</h2><p className="mt-2 text-[10px] text-gray-400">{resource.version} · 第 {page} 页</p></div>
          <h3 className="mt-6 text-sm font-black">1. 核心要求</h3>
          <div className="mt-4 space-y-3 text-[11px] leading-6 text-gray-700"><p>所有业务操作必须与包裹实物、运单状态和当前任务保持一致。</p><p>不得通过虚假扫描、提前签收或无留痕退件改变真实业务轨迹。</p><p>异常发生后，应在规定时限内完成纠正、登记和结果确认。</p></div>
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-[10px] leading-5 text-primary">重点提示：继续执行错误节点可能造成异常业务轨迹。</div>
        </article>
      </div>
    </div>
  );
}

const slides = [
  { kicker: "标准流程", title: "签收失败处理四步法", body: "联系留痕 · 地址核验 · 预约复派 · 异常登记" },
  { kicker: "场景一", title: "电话无人接听", body: "按规定间隔联系，保留电话与消息记录，不得直接签收或退件。" },
  { kicker: "场景二", title: "地址信息不完整", body: "联系网点核验客户资料，确认详细门牌后再继续派送。" }
];

function PptPreview({ resource }: { resource: LearningResource }) {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];
  return (
    <div className="overflow-hidden rounded-[24px] bg-gray-950 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 text-[10px] font-bold text-gray-300"><span>PowerPoint 预览</span><span>{slide + 1} / {slides.length}</span></div>
      <div className="aspect-video bg-white p-5">
        <div className="flex h-full flex-col rounded-[18px] bg-gray-950 p-5 text-white">
          <div className="flex items-center justify-between"><span className="text-[9px] font-black tracking-[0.16em] text-red-400">{current.kicker}</span><span className="text-[9px] text-gray-500">{resource.version}</span></div>
          <h2 className="mt-auto text-xl font-black leading-tight">{current.title}</h2>
          <p className="mt-3 text-[11px] leading-5 text-gray-300">{current.body}</p>
          <div className="mt-auto h-1 w-12 rounded-full bg-primary" />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4 text-white"><button onClick={() => setSlide(value => Math.max(0, value - 1))} disabled={slide === 0} className="disabled:opacity-30" aria-label="上一页"><ChevronLeft size={20} /></button><div className="flex gap-1.5">{slides.map((_, index) => <span key={index} className={`h-1.5 rounded-full ${index === slide ? "w-5 bg-primary" : "w-1.5 bg-gray-600"}`} />)}</div><button onClick={() => setSlide(value => Math.min(slides.length - 1, value + 1))} disabled={slide === slides.length - 1} className="disabled:opacity-30" aria-label="下一页"><ChevronRight size={20} /></button></div>
    </div>
  );
}

const errorRows = [
  ["E-SCAN-102", "节点与任务不一致", "撤销错扫并重扫", "网点操作"],
  ["E-NET-008", "网络连接异常", "切换网络后重试", "技术支持"],
  ["E-WAY-021", "运单状态锁定", "核验上一节点", "运营支持"],
  ["E-PIC-014", "照片上传失败", "压缩图片并重传", "网点操作"]
];

function ExcelPreview() {
  const [sheet, setSheet] = useState("错误码速查");
  return (
    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-green-700 px-4 py-3 text-white"><span className="flex items-center gap-2 text-xs font-black"><FileSpreadsheet size={17} />PDA_Error_Codes.xlsx</span><Maximize2 size={16} /></div>
      <div className="overflow-x-auto">
        <table className="w-[560px] border-collapse text-left text-[10px]">
          <thead><tr className="bg-gray-100 text-gray-500"><th className="border border-gray-200 px-3 py-2">错误码</th><th className="border border-gray-200 px-3 py-2">问题说明</th><th className="border border-gray-200 px-3 py-2">建议处理</th><th className="border border-gray-200 px-3 py-2">升级部门</th></tr></thead>
          <tbody>{errorRows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={`border border-gray-200 px-3 py-3 ${index === 0 ? "font-black text-primary" : "text-gray-600"}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="flex gap-1 border-t border-gray-200 bg-gray-50 px-3 pt-2">{["错误码速查", "处理部门"].map(item => <button key={item} onClick={() => setSheet(item)} className={`rounded-t-lg px-3 py-2 text-[9px] font-bold ${sheet === item ? "bg-white text-green-700" : "text-gray-400"}`}>{item}</button>)}</div>
    </div>
  );
}

function WebPreview({ resource }: { resource: LearningResource }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3"><div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[9px] text-gray-400"><Globe2 size={13} className="text-primary" /><span className="truncate">knowledge.jtcargo.com/article/{resource.id}</span></div></div>
      <article className="px-5 py-6">
        <Pill tone="red">{learningCategoryLabels[resource.category]}</Pill>
        <h2 className="mt-4 text-xl font-black leading-tight text-gray-950">{resource.title}</h2>
        <p className="mt-2 text-[10px] text-gray-400">{resource.source} · {resource.updatedAt}</p>
        <p className="mt-5 text-xs leading-6 text-gray-600">{resource.summary}</p>
        <div className="mt-5 space-y-3">
          {["问题发生后应该先做什么？", "什么时候需要联系网点？", "哪些信息必须完成留痕？"].map((question, index) => <div key={question} className="rounded-2xl bg-gray-50 p-4"><p className="text-xs font-black text-gray-800">{index + 1}. {question}</p><p className="mt-2 text-[10px] leading-5 text-gray-500">核对当前任务与现场信息，按有效规范完成处理并保留必要记录。</p></div>)}
        </div>
      </article>
    </div>
  );
}

function VideoPreview({ resource }: { resource: LearningResource }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="overflow-hidden rounded-[24px] bg-gray-950 text-white shadow-lg">
      <div className="flex aspect-video flex-col items-center justify-center px-7 text-center"><button onClick={() => setPlaying(value => !value)} className="tap flex h-14 w-14 items-center justify-center rounded-full bg-primary" aria-label={playing ? "暂停" : "播放"}>{playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</button><h2 className="mt-4 text-base font-black">{resource.title}</h2><p className="mt-2 text-[10px] text-gray-400">{playing ? "正在播放教程" : "点击播放"}</p></div>
      <div className="border-t border-white/10 p-4"><ProgressBar value={playing ? 38 : 0} color="bg-primary" /><div className="mt-3 flex justify-between text-[9px] text-gray-500"><span>{playing ? "02:18" : "00:00"}</span><span>06:00</span></div></div>
    </div>
  );
}

function PreviewFrame({ label, pages, children }: { label: string; pages: string; children: ReactNode }) {
  return <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 text-[10px] font-bold text-gray-500"><span>{label}</span><span>{pages}</span></div>{children}</div>;
}

function FormatIcon({ format }: { format: LearningFormat }) {
  if (format === "EXCEL") return <FileSpreadsheet size={20} />;
  if (format === "PPT") return <Presentation size={20} />;
  if (format === "WEB") return <Globe2 size={20} />;
  if (format === "VIDEO") return <Play size={20} />;
  return <FileText size={20} />;
}
