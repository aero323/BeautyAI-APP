import type { ReactNode } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ClipboardCheck, GraduationCap, House, MessagesSquare, UserRound } from "lucide-react";
import { cn } from "../../lib/utils";

const items = [
  { to: "/", label: "首页", icon: House },
  { to: "/learning", label: "学习", icon: GraduationCap },
  { to: "/practice", label: "练习", icon: MessagesSquare },
  { to: "/exam", label: "考试", icon: ClipboardCheck },
  { to: "/profile", label: "我的", icon: UserRound }
];

export default function MobileLayout() {
  const location = useLocation();
  const hideNavPrefixes = ["/assistant/session", "/learning/resource/", "/plans/", "/practice/", "/exam/", "/knowledge/", "/course/", "/video/", "/events/", "/business-action/", "/tasks", "/beauty"];
  const hideNav = hideNavPrefixes.some(prefix => location.pathname.startsWith(prefix));

  return (
    <div className="h-screen overflow-hidden bg-[#eef0f3] sm:py-4">
      <div className="relative mx-auto flex h-screen w-full max-w-[420px] flex-col overflow-hidden bg-[#f6f7f9] shadow-2xl sm:h-[calc(100vh-2rem)] sm:rounded-[32px] sm:border sm:border-gray-200">
        <main className={cn("min-h-0 flex-1 overflow-y-auto", !hideNav && "pb-24")}>
          <Outlet />
        </main>
        {!hideNav && (
          <nav className="absolute inset-x-0 bottom-0 z-50 flex h-[82px] items-center justify-around border-t border-gray-200 bg-white/95 px-1 pb-safe backdrop-blur-xl">
            {items.map(item => <NavItem key={item.to} {...item} />)}
          </nav>
        )}
      </div>
    </div>
  );
}

function NavItem({ to, label, icon: Icon }: { key?: string; to: string; label: string; icon: typeof House }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) => cn(
        "flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
        isActive ? "text-primary" : "text-gray-400"
      )}
    >
      {({ isActive }) => (
        <>
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-2xl", isActive && "bg-red-50")}>
            <Icon size={21} strokeWidth={isActive ? 2.6 : 2} />
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
