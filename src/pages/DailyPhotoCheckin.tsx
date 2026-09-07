import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode, type RefObject } from "react";
import { ArrowLeft, Camera, Check, CheckCircle2, ImagePlus, Images, RotateCcw, UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";
import makeupPreviewImage from "../assets/checkin/muslim-ba-makeup-preview.png";

type PhotoValue = {
  name: string;
  url: string;
};

type PhotoSlotProps = {
  title: string;
  description: string;
  photo: PhotoValue | null;
  cameraRef: RefObject<HTMLInputElement | null>;
  onChoose: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  capture: "user" | "environment";
  icon: ReactNode;
  previewImage: string;
};

export function DailyPhotoCheckin() {
  const navigate = useNavigate();
  const { user } = useMockAuth();
  const [makeupPhoto, setMakeupPhoto] = useState<PhotoValue | null>(null);
  const [counterPhoto, setCounterPhoto] = useState<PhotoValue | null>(null);
  const [submitted, setSubmitted] = useState(() => Boolean(user && readCheckin(user.id)));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const photoUrlsRef = useRef<{ makeup: string | null; counter: string | null }>({ makeup: null, counter: null });
  const makeupCameraRef = useRef<HTMLInputElement>(null);
  const counterCameraRef = useRef<HTMLInputElement>(null);

  const dateLabel = useMemo(() => {
    return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());
  }, []);

  useEffect(() => {
    photoUrlsRef.current = {
      makeup: makeupPhoto?.url ?? null,
      counter: counterPhoto?.url ?? null
    };
  }, [counterPhoto, makeupPhoto]);

  useEffect(() => {
    return () => {
      // Object URLs are local previews; release them when the screen leaves.
      if (photoUrlsRef.current.makeup) URL.revokeObjectURL(photoUrlsRef.current.makeup);
      if (photoUrlsRef.current.counter) URL.revokeObjectURL(photoUrlsRef.current.counter);
    };
  }, []);

  if (!user) return null;

  const photoCount = Number(Boolean(makeupPhoto)) + Number(Boolean(counterPhoto));
  const canSubmit = photoCount === 2 && !submitting;

  const updatePhoto = (slot: "makeup" | "counter", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("请上传 JPG、PNG 或其他图片格式的文件。");
      return;
    }

    const nextPhoto = { name: file.name, url: URL.createObjectURL(file) };
    if (slot === "makeup") {
      setMakeupPhoto(previous => {
        if (previous) URL.revokeObjectURL(previous.url);
        return nextPhoto;
      });
    } else {
      setCounterPhoto(previous => {
        if (previous) URL.revokeObjectURL(previous.url);
        return nextPhoto;
      });
    }
    setSubmitted(false);
    setError("");
  };

  const handleSubmit = () => {
    if (!makeupPhoto || !counterPhoto) {
      setError("请先准备妆容照和柜台出样照，两张一起提交。");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      window.localStorage.setItem(checkinStorageKey(user.id), "submitted");
      setSubmitted(true);
      setSubmitting(false);
      setError("");
    }, 550);
  };

  const handleEdit = () => {
    setSubmitted(false);
    setError("");
  };

  const handleRemove = (slot: "makeup" | "counter") => {
    if (slot === "makeup") {
      setMakeupPhoto(previous => {
        if (previous) URL.revokeObjectURL(previous.url);
        return null;
      });
    } else {
      setCounterPhoto(previous => {
        if (previous) URL.revokeObjectURL(previous.url);
        return null;
      });
    }
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="min-h-full bg-background pb-8">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-pink-100 bg-white/95 px-6 pb-4 pt-10 shadow-sm backdrop-blur-xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="返回上一页"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-2xl text-gray-500 transition-colors hover:bg-pink-50 hover:text-rose-500"
        >
          <ArrowLeft size={21} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-black tracking-tight text-gray-900">每日拍照打卡</h1>
          <p className="mt-0.5 truncate text-[11px] font-medium text-gray-400">{dateLabel} · BA 门店日常</p>
        </div>
        <span className="flex flex-none items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1.5 text-[10px] font-bold text-violet-600">
          <Camera size={13} /> 每日
        </span>
      </header>

      <div className="space-y-5 px-6 py-5">
        {submitted ? (
          <section className="rounded-[26px] border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={23} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-emerald-800">今日打卡已完成</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700/80">两张照片已一起提交，明天记得继续保持。</p>
              </div>
              <Check size={18} className="mt-1 flex-none text-emerald-500" />
            </div>
            <button
              type="button"
              onClick={handleEdit}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <RotateCcw size={15} /> 重新编辑照片
            </button>
          </section>
        ) : (
          <section className="rounded-[26px] border border-violet-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                <UploadCloud size={22} />
              </span>
              <div>
                <h2 className="text-sm font-black text-gray-900">完成今日门店记录</h2>
                <p className="mt-1 text-xs leading-5 text-gray-500">请准备两张照片，一起提交给区域团队。</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Requirement label="妆容照" done={Boolean(makeupPhoto)} />
              <Requirement label="柜台出样照" done={Boolean(counterPhoto)} />
            </div>
          </section>
        )}

        <PhotoSlot
          title="妆容照"
          description="正面清晰露脸，光线自然"
          photo={makeupPhoto}
          cameraRef={makeupCameraRef}
          onChoose={event => updatePhoto("makeup", event)}
          onRemove={() => handleRemove("makeup")}
          capture="user"
          icon={<Camera size={18} />}
          previewImage={makeupPreviewImage}
        />

        <PhotoSlot
          title="柜台出样照"
          description="拍到完整陈列和整洁台面"
          photo={counterPhoto}
          cameraRef={counterCameraRef}
          onChoose={event => updatePhoto("counter", event)}
          onRemove={() => handleRemove("counter")}
          capture="environment"
          icon={<ImagePlus size={18} />}
          previewImage="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85"
        />

        {error && (
          <p role="alert" className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-600">
            {error}
          </p>
        )}

        {!submitted && (
          <div className="sticky bottom-0 -mx-6 border-t border-pink-100 bg-background/95 px-6 pb-safe pt-4 backdrop-blur-xl">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            >
              {submitting ? "正在提交…" : `提交今日打卡 · ${photoCount}/2`}
              {!submitting && <Check size={17} />}
            </button>
            <p className="mt-2 text-center text-[10px] font-medium text-gray-400">两张照片都准备好后，才能一起提交</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoSlot({ title, description, photo, cameraRef, onChoose, onRemove, capture, icon, previewImage }: PhotoSlotProps) {
  return (
    <section className="rounded-[24px] border border-pink-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-pink-50 text-rose-500">{icon}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-gray-900">{title}</h2>
          <p className="mt-0.5 text-[11px] font-medium text-gray-400">{description}</p>
        </div>
        {photo && <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-600"><Check size={12} /> 已准备</span>}
      </div>

      {photo ? (
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[18px] bg-gray-100">
          <img src={photo.url} alt={`${title}预览`} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`移除${title}`}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <X size={17} />
          </button>
          <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-5 text-[10px] font-medium text-white">{photo.name}</span>
        </div>
      ) : (
        <div className="relative mt-4 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[18px] border border-pink-100 bg-pink-50 text-center">
          <img src={previewImage} alt={`${title}示例预览`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative flex flex-col items-center rounded-2xl bg-black/58 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/18"><Images size={17} /></span>
            <p className="mt-1.5 text-xs font-black">还没有添加照片</p>
            <p className="mt-0.5 text-[10px] font-medium text-white/75">支持 JPG、PNG</p>
          </div>
        </div>
      )}

      <div className="mt-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 text-xs font-black text-rose-600 transition-colors hover:bg-rose-100"
        >
          <Camera size={16} /> 拍照
        </button>
      </div>
      <input ref={cameraRef} type="file" accept="image/*" capture={capture} className="hidden" aria-label={`${title}使用相机拍摄`} onChange={onChoose} />
    </section>
  );
}

function Requirement({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 ${done ? "border-emerald-100 bg-emerald-50/70" : "border-gray-100 bg-gray-50"}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-white text-gray-300"}`}>
        {done ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
      </span>
      <span className={`truncate text-[11px] font-bold ${done ? "text-emerald-700" : "text-gray-500"}`}>{label}</span>
    </div>
  );
}

function dateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function checkinStorageKey(userId: string) {
  return `beautyai.photoCheckin.${userId}.${dateKey()}`;
}

function readCheckin(userId: string) {
  return window.localStorage.getItem(checkinStorageKey(userId)) === "submitted";
}
