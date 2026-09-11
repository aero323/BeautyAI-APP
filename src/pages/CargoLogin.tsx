import { useEffect, useState } from "react";
import { BadgeCheck, Building2, MapPin, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useCargo } from "../cargo/CargoContext";
import { cargoUsers } from "../cargo/data";

export function CargoLogin() {
  const { loginAs } = useCargo();
  const [params] = useSearchParams();
  const [ssoLoading, setSsoLoading] = useState(Boolean(params.get("token")));

  useEffect(() => {
    if (!params.get("token")) return;
    const timer = window.setTimeout(() => {
      loginAs("courier-shenzhen");
      setSsoLoading(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [loginAs, params]);

  if (ssoLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-6">
        <div className="card w-full max-w-[380px] p-8 text-center">
          <div className="pulse-soft mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary text-white"><ShieldCheck size={30} /></div>
          <h1 className="mt-5 text-xl font-black">正在验证 J&T APP 身份</h1>
          <p className="mt-2 text-sm text-gray-400">正在交换模拟 SSO Token，请稍候</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] px-5 pb-8 pt-14">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary text-white shadow-lg shadow-red-200"><Building2 size={27} /></div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">J&amp;T Cargo</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">智慧业务助手</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">选择模拟员工身份，体验业务问答、场景模拟和自动培训闭环。</p>
        </div>
        <div className="space-y-4">
          {cargoUsers.map((user, index) => (
            <button key={user.id} onClick={() => loginAs(user.id)} className="tap card w-full p-5 text-left hover:border-red-200">
              <div className="flex items-center gap-4">
                <img src={user.avatarUrl} alt={user.name} className="h-14 w-14 rounded-2xl border border-gray-100 bg-gray-50 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-gray-900">{user.name}</h2>
                    {index === 0 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-primary">主演示</span>}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500"><MapPin size={12} className="text-primary" />{user.station}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{user.role} · {user.employeeNo}</p>
                </div>
                <BadgeCheck size={22} className="text-gray-300" />
              </div>
              <div className="mt-4 rounded-2xl bg-gray-950 py-3 text-center text-xs font-black text-white">模拟 SSO 登录</div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] leading-5 text-gray-400">当前为前端 Mock，身份、Push 和业务接口均为模拟数据。</p>
      </div>
    </div>
  );
}
