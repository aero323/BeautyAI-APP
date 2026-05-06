import type { ReactNode } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, MessageSquare, BookOpen, User, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

export default function MobileLayout() {
  const location = useLocation();
  const hideNavPaths = [
    "/practice/chat", "/practice/result", 
    "/script/chat", "/script/result",
    "/exam/run", "/exam/intro", "/exam/result",
    "/reading"
  ];
  
  const shouldHideNav = hideNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex justify-center min-h-screen bg-background dark:bg-gray-900">
      <div className="w-full max-w-[420px] bg-white dark:bg-gray-950 shadow-2xl min-h-screen flex flex-col relative overflow-hidden sm:border-x sm:border-pink-100">
        <div className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </div>
        
        {!shouldHideNav && (
          <div className="absolute bottom-0 w-full h-20 bg-white/90 backdrop-blur-md dark:bg-gray-950/90 border-t border-pink-100 dark:border-gray-800 flex items-center justify-around px-2 pb-safe rounded-t-3xl shadow-[0_-4px_20px_rgba(244,63,94,0.05)] z-50">
            <NavItem to="/" icon={<Home size={22} />} label="Home" />
            <NavItem to="/course" icon={<BookOpen size={22} />} label="Course" />
            <NavItem to="/practice" icon={<MessageSquare size={22} />} label="Practice" />
            <NavItem to="/exam" icon={<Zap size={22} />} label="Exam" />
            <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
          </div>
        )}
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-14 h-full pt-2 space-y-1 transition-colors",
          isActive ? "text-rose-500" : "text-gray-400 hover:text-rose-400 dark:text-gray-400 dark:hover:text-gray-100"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cn(
            "flex h-8 w-8 items-center justify-center rounded-2xl transition-colors",
            isActive ? "bg-rose-50 text-rose-500" : "text-current"
          )}>
            {icon}
          </span>
          <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
