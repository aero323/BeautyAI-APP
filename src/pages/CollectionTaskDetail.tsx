import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, CircleAlert, FileAudio, FileVideo, Mic, RotateCcw, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";
import type { CollectionSubmission } from "../data/mockData";

type DraftFile = CollectionSubmission & { source: "upload" | "recording" };

const formatSize = (bytes: number) => `${Math.max(0.1, bytes / 1024 / 1024).toFixed(1)} MB`;
const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}分${Math.round(seconds % 60)}秒`;

export function CollectionTaskDetail() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { user, getMissionById, getCollectionSubmission, submitCollection, replaceCollectionSubmission } = useMockAuth();
  const mission = getMissionById(Number(missionId));
  const task = mission?.collectionTask;
  const existing = mission ? getCollectionSubmission(mission.id) : null;
  const [draft, setDraft] = useState<DraftFile | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [permissionError, setPermissionError] = useState("");
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => {
    previewStream?.getTracks().forEach(track => track.stop());
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [previewStream]);

  useEffect(() => {
    if (videoRef.current && previewStream) videoRef.current.srcObject = previewStream;
  }, [previewStream]);

  const acceptLabel = useMemo(() => "Demo 模式 · 任意文件", []);
  if (!user || !mission || !task) return <div className="p-6 text-sm text-gray-500">采集任务不存在。</div>;

  const validateAndRead = async (file: File, source: DraftFile["source"]) => {
    setError("");
    try {
      const url = URL.createObjectURL(file);
      // Demo mode intentionally accepts any local file. If it is not a playable
      // audio/video asset, use a short mock duration so the happy path remains demoable.
      const duration = await readDuration(url, task.mediaType).catch(() => 30);
      const dataUrl = await readAsDataUrl(file);
      URL.revokeObjectURL(url);
      setDraft({ name: file.name || "demo-file", mimeType: file.type || (task.mediaType === "video" ? "video/mp4" : "audio/mpeg"), size: file.size, durationSec: duration, url: dataUrl, submittedAt: new Date().toISOString(), source });
    } catch { setError("Demo 文件读取失败，请重新选择一次。"); }
  };

  const startRecording = async () => {
    setPermissionError(""); setError(""); setCountdown(3);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(task.mediaType === "video" ? { video: true, audio: true } : { audio: true });
      let value = 3;
      const countdownTimer = window.setInterval(() => {
        value -= 1;
        if (value <= 0) { window.clearInterval(countdownTimer); setCountdown(null); beginRecorder(stream); }
        else setCountdown(value);
      }, 700);
      setPreviewStream(stream);
    } catch { setCountdown(null); setPermissionError(task.mediaType === "video" ? "需要摄像头和麦克风权限才能现场录制。" : "需要麦克风权限才能现场录音。"); }
  };

  const beginRecorder = (stream: MediaStream) => {
    const mime = task.mediaType === "video" ? "video/webm" : "audio/webm";
    const recorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported(mime) ? { mimeType: mime } : undefined);
    chunksRef.current = [];
    recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mime });
      const file = new File([blob], `优秀案例-${new Date().toISOString().slice(0, 10)}.${task.mediaType === "video" ? "webm" : "webm"}`, { type: blob.type });
      await validateAndRead(file, "recording");
      stream.getTracks().forEach(track => track.stop()); setPreviewStream(null); setRecording(false);
    };
    recorderRef.current = recorder; recorder.start(); setRecording(true); setElapsed(0);
    timerRef.current = window.setInterval(() => setElapsed(value => { if (value + 1 >= task.maxDurationSec) stopRecording(); return value + 1; }), 1000);
  };

  const stopRecording = () => { if (timerRef.current) window.clearInterval(timerRef.current); recorderRef.current?.stop(); };
  const submit = () => {
    if (!draft) return;
    setBusy(true);
    window.setTimeout(() => {
      const payload: CollectionSubmission = { ...draft };
      (existing ? replaceCollectionSubmission : submitCollection)(mission.id, payload);
      navigate(`/tasks/collection/${mission.id}/success`, { replace: true });
    }, 450);
  };

  return <div className="min-h-full bg-background pb-32">
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-pink-100 bg-white/95 px-6 pb-4 pt-10 shadow-sm backdrop-blur-xl">
      <button type="button" onClick={() => navigate(-1)} className="-ml-2 flex h-10 w-10 items-center justify-center rounded-2xl text-gray-500 hover:bg-pink-50"><ArrowLeft size={21} /></button>
      <div className="min-w-0 flex-1"><h1 className="truncate text-xl font-black text-gray-900">优秀案例采集</h1><p className="mt-0.5 text-[11px] text-gray-400">{mission.dueText} · {mission.sourceLabel}</p></div>
      <span className="rounded-full bg-violet-50 px-2.5 py-1.5 text-[10px] font-black text-violet-600">{task.mediaType === "video" ? "视频采集" : "音频采集"}</span>
    </header>
    <div className="space-y-5 px-6 py-5">
      <section className="rounded-[26px] border border-pink-100 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-rose-500">{task.mediaType === "video" ? <FileVideo size={22} /> : <FileAudio size={22} />}</span><div><p className="text-sm font-black text-gray-900">记录你的优秀案例</p><p className="mt-1 text-xs leading-5 text-gray-500">可以现场录制，也可以上传已有素材。请围绕指定目标完整介绍。</p></div></div></section>
      <section className="rounded-[26px] border border-pink-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-black text-gray-900">采集目标</h2><span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">{task.targetMode === "product" ? "指定产品" : "自定义场景"}</span></div><h3 className="mt-4 text-base font-black text-gray-900">{task.targetTitle}</h3>{task.targetVersion && <p className="mt-1 text-[11px] text-gray-400">{task.targetVersion}</p>}<p className="mt-3 rounded-2xl bg-rose-50/60 p-3 text-xs leading-5 text-gray-600">{task.targetDescription}</p></section>
      <section className="grid grid-cols-2 gap-3"><Info label="最长时长" value={formatDuration(task.maxDurationSec)} /><Info label="文件上限" value={`${task.maxFileSizeMb} MB`} /><Info label="支持格式" value={acceptLabel} /><Info label="提交方式" value="单个最终文件" /></section>
      {permissionError && <div role="alert" className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-700"><div className="flex items-center gap-2 font-black"><CircleAlert size={16} />{permissionError}</div><button type="button" onClick={startRecording} className="mt-3 font-black underline">再次授权</button><span className="mx-2">或</span><label className="font-black underline">改用上传<input type="file" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) void validateAndRead(file, "upload"); }} /></label></div>}
      {previewStream && <section className="overflow-hidden rounded-[26px] border border-pink-100 bg-gray-950 p-3 text-white shadow-sm">{task.mediaType === "video" ? <video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full rounded-2xl object-cover" /> : <div className="flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-900 to-fuchsia-900"><div className="flex items-center gap-2 text-sm font-black"><Mic size={20} />正在录音 · {formatDuration(elapsed)}</div></div>}{countdown !== null && <div className="mt-2 text-center text-2xl font-black">{countdown}</div>}{recording && <button type="button" onClick={stopRecording} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white text-xs font-black text-gray-900">停止录制</button>}</section>}
      {draft && <section className="rounded-[26px] border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm"><div className="flex items-center gap-2 text-sm font-black text-emerald-800"><Check size={17} />素材已准备好</div>{task.mediaType === "video" ? <video src={draft.url} controls className="mt-3 aspect-video w-full rounded-2xl bg-black object-cover" /> : <audio src={draft.url} controls className="mt-3 w-full" />}<div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-emerald-800"><span className="truncate">{draft.name}</span><span className="flex-none">{formatSize(draft.size)} · {formatDuration(draft.durationSec)}</span></div><label className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white text-xs font-black text-emerald-700"><RotateCcw size={15} />更换文件<input type="file" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) void validateAndRead(file, "upload"); }} /></label></section>}
      {!draft && !previewStream && <div className="grid grid-cols-2 gap-3"><button type="button" onClick={startRecording} className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-[24px] border border-pink-200 bg-rose-50 text-xs font-black text-rose-600"><Camera size={23} />现场录制</button><label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-[24px] border border-gray-200 bg-white text-xs font-black text-gray-700"><UploadCloud size={23} className="text-rose-500" />上传文件<input type="file" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) void validateAndRead(file, "upload"); }} /></label></div>}
      {error && <p role="alert" className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-600">{error}</p>}
    </div>
    {draft && <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[420px] border-t border-pink-100 bg-background/95 px-6 pb-safe pt-4 backdrop-blur-xl"><button type="button" disabled={busy} onClick={submit} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-sm font-black text-white shadow-lg shadow-rose-200 disabled:opacity-50">{busy ? "正在提交…" : "提交采集"}<Check size={17} /></button></footer>}
  </div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"><p className="text-[10px] font-bold text-gray-400">{label}</p><p className="mt-1 text-xs font-black text-gray-800">{value}</p></div>; }
function readAsDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }); }
function readDuration(url: string, type: "video" | "audio") { return new Promise<number>((resolve, reject) => { const media = document.createElement(type); media.preload = "metadata"; media.onloadedmetadata = () => resolve(Number.isFinite(media.duration) ? media.duration : 0); media.onerror = () => reject(new Error("metadata")); media.src = url; }); }
