import { MapPin, Store, Sparkles } from "lucide-react";
import { mockUsers } from "../data/mockData";
import { useMockAuth } from "../context/MockAuthContext";

export function Login() {
  const { loginAs } = useMockAuth();

  return (
    <div className="min-h-screen bg-background px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-[420px]">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-200 mb-5">
            <Sparkles size={28} />
          </div>
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">BeautyAI Learner App</p>
          <h1 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">选择 Mock 学员身份</h1>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            直接进入不同大区的店员视角，任务、课程、练习和考试会按对应大区展示。
          </p>
        </div>

        <div className="space-y-4">
          {mockUsers.map(user => (
            <button
              key={user.id}
              onClick={() => loginAs(user.id)}
              className="w-full bg-white border border-pink-100 rounded-[28px] p-5 text-left shadow-sm hover:shadow-md hover:border-rose-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 flex-shrink-0">
                  <img
                    src={user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black text-gray-800">{user.name}</h2>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <MapPin size={13} className="text-rose-400" />
                    {user.regionName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <Store size={13} className="text-indigo-400" />
                    {user.storeName}
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-black py-3 rounded-2xl text-center shadow-sm shadow-rose-100">
                以该店员身份登录
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
