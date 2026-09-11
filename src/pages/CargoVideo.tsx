import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { PageHeader, Pill, ProgressBar } from "../cargo/components";
import { knowledgeDocuments } from "../cargo/data";

export function CargoVideo() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const doc = knowledgeDocuments.find(item => item.id === id) ?? knowledgeDocuments.find(item => item.format === "VIDEO")!;
  const start = Number(params.get("t") ?? doc.videoTime ?? 0);
  const [seconds, setSeconds] = useState(start);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setSeconds(value => value >= 180 ? 180 : value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [playing]);
  const time = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  return (
    <div className="min-h-full bg-background pb-6">
      <PageHeader title={doc.title} subtitle={`${doc.version} · 视频片段定位`} />
      <div className="page-x py-5">
        <div className="overflow-hidden rounded-[28px] bg-gray-950 text-white shadow-lg">
          <div className="flex min-h-64 flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#374151,_#030712_70%)] px-7 text-center">
            <Pill tone="red">AI 已定位到 01:35</Pill>
            <h2 className="mt-5 text-xl font-black">进入“扫描记录”撤销错误节点</h2>
            <p className="mt-3 text-xs leading-5 text-gray-300">核对运单后点击最近一次操作，选择撤销原因并重新扫描。</p>
          </div>
          <div className="p-4">
            <ProgressBar value={(seconds / 180) * 100} color="bg-primary" />
            <div className="mt-4 flex items-center justify-between"><button onClick={() => setSeconds(start)}><RotateCcw size={18} /></button><button onClick={() => setPlaying(!playing)} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button><button><Volume2 size={18} /></button></div>
            <p className="mt-3 text-center text-[10px] text-gray-400">{time} / 03:00</p>
          </div>
        </div>
        <div className="card mt-4 p-5"><h3 className="font-black">片段说明</h3><p className="mt-2 text-xs leading-6 text-gray-500">该片段由 AI 根据问题“PDA 错扫后怎么撤销”自动定位。来源与当前有效 SOP V3.2 保持一致。</p></div>
      </div>
    </div>
  );
}
