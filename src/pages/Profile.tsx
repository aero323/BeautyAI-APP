import { useRef, useState, type ChangeEvent } from "react";
import { BookOpen, CalendarCheck, Clock3, GraduationCap, ImagePlus, LogOut, MapPin, Store, Trophy, Camera } from "lucide-react";
import { useMockAuth } from "../context/MockAuthContext";

export function Profile() {
  const { user, regionData, logout, updateAvatar } = useMockAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  if (!user || !regionData) return null;

  const avatarSrc = user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`;

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateAvatar(url);
    setAvatarPickerOpen(false);
    event.target.value = "";
  };

  const leaderboard = [...regionData.leaderboard].sort((a, b) => a.rank - b.rank);
  const myRank = leaderboard.find(item => item.isMe);
  const statCards = [
    {
      label: "任务完成率",
      value: `${regionData.stats.taskCompletionRate}%`,
      icon: CalendarCheck,
      tone: "emerald"
    },
    {
      label: "最新考试分数",
      value: `${regionData.stats.latestExamScore}分`,
      icon: GraduationCap,
      tone: "indigo"
    },
    {
      label: "已学课件数",
      value: `${regionData.stats.totalCoursesStudied}个`,
      icon: BookOpen,
      tone: "sky"
    },
    {
      label: "累积练习时长",
      value: regionData.stats.totalPracticeTime,
      icon: Clock3,
      tone: "amber"
    }
  ];

  return (
    <div className="min-h-full bg-background pb-8">
      <div className="bg-primary pt-12 pb-7 px-6 text-white shadow-lg shadow-rose-200 rounded-b-[28px] relative z-10">
        <button onClick={logout} className="absolute top-12 right-6 text-white/85 hover:text-white bg-white/10 border border-white/20 rounded-full p-2">
          <LogOut size={18} />
        </button>

        <div className="flex items-center gap-4 mt-3">
          <div className="relative shrink-0">
            <button
              onClick={() => setAvatarPickerOpen(true)}
              className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 relative overflow-hidden ring-4 ring-white shadow-sm"
            >
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            </button>
            <button
              onClick={handlePickAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-rose-500 border border-rose-100 shadow-sm flex items-center justify-center"
            >
              <ImagePlus size={14} />
            </button>
          </div>

          <div className="min-w-0 pr-10">
            <h1 className="text-2xl font-black tracking-tight truncate">{user.name}</h1>
            <div className="mt-2 space-y-1 text-pink-50">
              <p className="text-xs font-bold flex items-center gap-1.5">
                <MapPin size={13} />
                <span className="truncate">{user.regionName}</span>
              </p>
              <p className="text-xs font-medium flex items-center gap-1.5 text-pink-100">
                <Store size={13} />
                <span className="truncate">{user.storeName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <section className="bg-white rounded-[24px] p-5 shadow-sm border border-pink-100">
          <h2 className="text-gray-900 font-black text-lg mb-4">学习数据</h2>
          <div className="space-y-3">
            {statCards.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`rounded-2xl p-4 border flex items-center justify-between gap-4 ${getStatTone(card.tone).box}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${getStatTone(card.tone).iconBox}`}>
                      <Icon size={16} />
                    </span>
                    <span className="text-sm font-bold text-gray-600 truncate">{card.label}</span>
                  </div>
                  <p className={`text-xl font-black leading-none whitespace-nowrap ${getStatTone(card.tone).value}`}>{card.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-[24px] shadow-sm border border-pink-100 p-5">
          <div className="flex justify-between items-start gap-3 mb-5">
            <div>
              <h2 className="text-gray-900 font-black text-lg">大区排名</h2>
              <p className="text-xs text-gray-400 font-medium mt-1">{user.regionName}</p>
            </div>
            {myRank && (
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400">我的排名</p>
                <p className="text-2xl font-black text-primary leading-none">#{myRank.rank}</p>
                <p className="text-[10px] font-medium text-gray-400 mt-1">共 {regionData.stats.regionRankTotal} 人</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {leaderboard.map(item => (
              <div key={`${item.rank}-${item.name}`} className={`flex items-center gap-3 rounded-2xl ${item.isMe ? "bg-pink-50 p-3 border border-pink-100" : "py-2"}`}>
                <span className={`text-base font-black w-7 text-center ${
                  item.rank === 1 ? "text-yellow-500" :
                  item.isMe ? "text-primary" :
                  "text-gray-300"
                }`}>
                  {item.rank === 1 ? <Trophy size={18} className="mx-auto fill-yellow-100" /> : item.rank}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 ${
                  item.rank === 1 ? "bg-yellow-100 border border-yellow-300" :
                  item.isMe ? "bg-pink-100 border-2 border-pink-500" :
                  "bg-gray-100"
                }`}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${item.isMe ? "text-primary" : "text-gray-800"}`}>
                    {item.name} {item.isMe && "· 我"}
                  </p>
                  <p className={`text-[10px] truncate ${item.isMe ? "text-pink-400" : "text-gray-400"}`}>{item.region}</p>
                </div>
                <span className={`text-sm font-black ${item.isMe ? "text-primary" : "text-gray-700"}`}>{item.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {avatarPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center">
          <div className="w-full max-w-[420px] bg-white rounded-t-[28px] p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-gray-800">更换头像</h3>
              <button onClick={() => setAvatarPickerOpen(false)} className="text-gray-400 text-sm font-bold">取消</button>
            </div>
            <div className="space-y-2">
              <button onClick={handlePickAvatar} className="w-full h-14 rounded-2xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center gap-2">
                <Camera size={18} /> 从相册选择
              </button>
              <button onClick={handlePickAvatar} className="w-full h-14 rounded-2xl bg-gray-50 text-gray-700 font-bold flex items-center justify-center gap-2">
                <ImagePlus size={18} /> 使用相机拍摄
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleAvatarChange}
      />
    </div>
  );
}

function getStatTone(tone: string) {
  const tones: Record<string, { box: string; iconBox: string; value: string }> = {
    emerald: {
      box: "bg-emerald-50/80 border-emerald-100",
      iconBox: "bg-emerald-100 text-emerald-600",
      value: "text-emerald-700"
    },
    indigo: {
      box: "bg-indigo-50/80 border-indigo-100",
      iconBox: "bg-indigo-100 text-indigo-600",
      value: "text-indigo-700"
    },
    sky: {
      box: "bg-sky-50/80 border-sky-100",
      iconBox: "bg-sky-100 text-sky-600",
      value: "text-sky-700"
    },
    amber: {
      box: "bg-amber-50/80 border-amber-100",
      iconBox: "bg-amber-100 text-amber-600",
      value: "text-amber-700"
    }
  };

  return tones[tone] ?? tones.indigo;
}
