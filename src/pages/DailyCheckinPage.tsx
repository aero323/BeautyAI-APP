import { useMemo, useState } from "react";
import { ArrowLeft, Camera, Check, CheckCircle2, ImagePlus, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";

type Photo = { name: string; url: string };

export function DailyCheckinPage() {
  const navigate = useNavigate();
  const { user } = useMockAuth();
  const [makeup, setMakeup] = useState<Photo | null>(null);
  const [counter, setCounter] = useState<Photo | null>(null);
  const [submitted, setSubmitted] = useState(() => Boolean(user && window.localStorage.getItem(checkinKey(user.id))));
  const [error, setError] = useState("");
  const dateLabel = useMemo(() => new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date()), []);
  if (!user) return null;

  const choose = (slot: "makeup" | "counter", file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("请上传 JPG、PNG 或其他图片格式的文件。"); return; }
    const photo = { name: file.name, url: URL.createObjectURL(file) };
    if (slot === "makeup") { if (makeup) URL.revokeObjectURL(makeup.url); setMakeup(photo); }
    else { if (counter) URL.revokeObjectURL(counter.url); setCounter(photo); }
    setSubmitted(false); setError("");
  };

  const submit = () => {
    if (!makeup || !counter) { setError("请先准备妆容照和柜台出样照，两张一起提交。"); return; }
    window.localStorage.setItem(checkinKey(user.id), new Date().toISOString());
    setSubmitted(true);
  };

  return <div className="min-h-full bg-background pb-8">
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-pink-100 bg-white/95 px-6 pb-4 pt-10 shadow-sm backdrop-blur-xl"><button type="button" onClick={() => navigate(-1)} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-2xl text-gray-500 hover:bg-pink-50"><ArrowLeft size={21} /></button><div className="min-w-0 flex-1"><h1 className="truncate text-xl font-black text-gray-900">每日拍照打卡</h1><p className="mt-0.5 text-[11px] text-gray-400">{dateLabel} · BA 门店日常</p></div><span className="rounded-full bg-violet-50 px-2.5 py-1.5 text-[10px] font-black text-violet-600"><Camera size={13} className="inline mr-1" />每日</span></header>
    <div className="space-y-5 px-6 py-5">
      {submitted ? <section className="rounded-[26px] border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm"><div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600"><CheckCircle2 size={23} /></span><div className="flex-1"><p className="text-sm font-black text-emerald-800">今日打卡已完成</p><p className="mt-1 text-xs leading-5 text-emerald-700/80">两张照片已提交，明天记得继续保持。</p></div><Check size={18} className="text-emerald-500" /></div><button type="button" onClick={() => setSubmitted(false)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white text-xs font-black text-emerald-700"><RotateCcw size={15} />重新编辑照片</button></section> : <section className="rounded-[26px] border border-violet-100 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-500"><Camera size={22} /></span><div><h2 className="text-sm font-black text-gray-900">完成今日门店记录</h2><p className="mt-1 text-xs leading-5 text-gray-500">请准备妆容照和柜台出样照，两张一起提交。</p></div></div></section>}
      <PhotoSlot title="妆容照" description="正面清晰露脸，光线自然" photo={makeup} capture="user" onChoose={file => choose("makeup", file)} />
      <PhotoSlot title="柜台出样照" description="拍到完整陈列和整洁台面" photo={counter} capture="environment" onChoose={file => choose("counter", file)} />
      {error && <p role="alert" className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-600">{error}</p>}
      {!submitted && <button type="button" onClick={submit} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-sm font-black text-white shadow-lg shadow-rose-200">提交今日打卡 <Check size={17} /></button>}
    </div>
  </div>;
}

function PhotoSlot({ title, description, photo, capture, onChoose }: { title: string; description: string; photo: Photo | null; capture: "user" | "environment"; onChoose: (file?: File) => void }) {
  return <section className="rounded-[24px] border border-pink-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-rose-500"><ImagePlus size={18} /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-black text-gray-900">{title}</h2><p className="mt-0.5 text-[11px] text-gray-400">{description}</p></div>{photo && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-600">已准备</span>}</div>{photo ? <img src={photo.url} alt={`${title}预览`} className="mt-4 aspect-[16/10] w-full rounded-[18px] object-cover" /> : <div className="mt-4 flex aspect-[16/10] items-center justify-center rounded-[18px] border border-dashed border-pink-200 bg-pink-50 text-xs font-bold text-pink-400">还没有添加照片</div>}<label className="mt-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-50 text-xs font-black text-rose-600"><Camera size={16} />{photo ? "更换照片" : "拍照或上传"}<input type="file" accept="image/*" capture={capture} className="hidden" onChange={event => { onChoose(event.target.files?.[0]); event.target.value = ""; }} /></label></section>;
}

function checkinKey(userId: string) { const date = new Date(); const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; return `beautyai.dailyCheckin.${userId}.${day}`; }
