import type { ReactNode } from "react";
import { ChevronRight, Clock } from "lucide-react";
import type { CourseItem } from "../data/mockData";
import { cn } from "../lib/utils";

interface CourseCardProps {
  key?: string | number;
  course: CourseItem;
  href?: string;
  onClick?: () => void;
  highlighted?: boolean;
  completed?: boolean;
  trailing?: ReactNode;
  className?: string;
}

export function CourseCard({
  course,
  href,
  onClick,
  highlighted = false,
  completed = false,
  trailing,
  className
}: CourseCardProps) {
  const displayedProgress = completed ? 100 : course.progress;
  const isComplete = displayedProgress >= 100;
  const actionLabel = getCourseActionLabel(displayedProgress);

  const content = (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all",
        isComplete
          ? "border-green-100 bg-green-50/40"
          : highlighted
            ? "border-rose-200 shadow-md"
            : "border-pink-100",
        className
      )}
    >
      <div className={cn("relative aspect-[16/9] w-full bg-gradient-to-br", course.coverGradient)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_46%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(15,23,42,0.12))]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-black leading-tight text-gray-800">{course.title}</h3>
          {trailing ?? <ChevronRight size={18} className="text-gray-300" />}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-gray-500">{course.description}</p>

        <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
          <span className="flex items-center gap-1 text-gray-400"><Clock size={12} />{course.duration}</span>
          <span className={cn(isComplete ? "text-green-700" : "text-rose-500")}>{displayedProgress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-rose-50">
          <div
            className={cn(
              "h-full rounded-full",
              isComplete ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-rose-400"
            )}
            style={{ width: `${displayedProgress}%` }}
          />
        </div>

        <div className="mt-4">
          <span
            className={cn(
              "block w-full rounded-2xl px-4 py-3 text-center text-xs font-black",
              isComplete
                ? "bg-green-100 text-green-700"
                : displayedProgress === 0
                  ? "bg-gray-900 text-white"
                  : "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm shadow-rose-100"
            )}
          >
            {actionLabel}
          </span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

function getCourseActionLabel(progress: number) {
  if (progress >= 100) return "再学一遍";
  if (progress <= 0) return "开始学习";
  return "继续学习";
}
