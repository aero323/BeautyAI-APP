import type { ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { useMockAuth } from "../context/MockAuthContext";
import { getCourseUnitId } from "../data/mockData";

type CourseStatusFilter = "all" | "not_started" | "in_progress" | "completed";
type CourseSourceFilter = "all" | "national" | "regional";
type CourseSortOrder = "newest" | "oldest";
type FilterSheet = "status" | "source" | "sort" | null;

export function Course() {
  const [searchParams] = useSearchParams();
  const [keywordDraft, setKeywordDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<CourseSourceFilter>("all");
  const [sortOrder, setSortOrder] = useState<CourseSortOrder>("newest");
  const [activeSheet, setActiveSheet] = useState<FilterSheet>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, regionData, missions, getMissionById } = useMockAuth();
  if (!user || !regionData) return null;

  const missionId = Number(searchParams.get("missionId"));
  const selectedCourseId = Number(searchParams.get("courseId"));
  const selectedMission = Number.isNaN(missionId) ? undefined : getMissionById(missionId);
  const normalizedKeyword = keyword.trim().toLowerCase();

  const courseItems = regionData.courses
    .map(course => {
      const completed = missions.some(
        mission =>
          mission.type === "course" &&
          mission.studyTask?.courseIds.includes(course.id) &&
          mission.completedUnitIds?.includes(getCourseUnitId(course.id))
      );

      const progress = completed ? 100 : course.progress;
      const status: CourseStatusFilter =
        progress >= 100 ? "completed" :
        progress <= 0 ? "not_started" :
        "in_progress";

      return { course, completed, progress, status };
    })
    .filter(({ course, status }) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        course.title.toLowerCase().includes(normalizedKeyword) ||
        course.description.toLowerCase().includes(normalizedKeyword);

      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesSource = sourceFilter === "all" || course.source === sourceFilter;

      return matchesKeyword && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      const aTime = new Date(a.course.createdAt).getTime();
      const bTime = new Date(b.course.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="px-6 py-6 pb-8 bg-white rounded-b-[48px] shadow-sm border-b border-pink-100">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight mt-8">All Course</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">除了任务之外，你可以在这里自由学习</p>

        {selectedMission && (
          <div className="mt-4 rounded-3xl border border-pink-100 bg-rose-50/70 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400">Current Task</p>
            <p className="mt-1 text-sm font-black text-gray-800">{selectedMission.title}</p>
            <p className="mt-1 text-[11px] text-gray-500">{selectedMission.sourceLabel} · {selectedMission.dueText}</p>
          </div>
        )}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            label={keyword ? `搜索: ${keyword}` : "搜索"}
            icon={<Search size={14} />}
            active={keyword.length > 0 || searchOpen}
            onClick={() => {
              setKeywordDraft(keyword);
              setSearchOpen(true);
            }}
          />
          <FilterChip
            label={getStatusLabel(statusFilter)}
            active={statusFilter !== "all" || activeSheet === "status"}
            onClick={() => setActiveSheet("status")}
          />
          <FilterChip
            label={getSourceLabel(sourceFilter)}
            active={sourceFilter !== "all" || activeSheet === "source"}
            onClick={() => setActiveSheet("source")}
          />
          <FilterChip
            label={getSortLabel(sortOrder)}
            icon={<SlidersHorizontal size={14} />}
            active={sortOrder !== "newest" || activeSheet === "sort"}
            onClick={() => setActiveSheet("sort")}
          />
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {courseItems.length > 0 ? (
          courseItems.map(({ course, completed }) => (
            <div key={course.id} className="space-y-3">
              <CourseCard
                course={course}
                href={`/course?courseId=${course.id}${selectedMission ? `&missionId=${selectedMission.id}` : ""}`}
                highlighted={selectedCourseId === course.id}
                completed={completed}
              />
            </div>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-pink-200 bg-white px-5 py-8 text-center">
            <p className="text-sm font-black text-gray-700">没有匹配的课件</p>
            <p className="mt-2 text-xs text-gray-400">换个关键词，或者调整筛选条件试试</p>
          </div>
        )}
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm">
          <div className="mx-auto flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl sm:border-x sm:border-pink-100">
            <div className="flex items-center gap-3 px-6 pt-12 pb-4 border-b border-pink-100">
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-gray-500"
              >
                <X size={16} />
              </button>
              <div className="flex-1 rounded-[22px] border border-pink-100 bg-rose-50/70 px-4 py-3">
                <input
                  autoFocus
                  value={keywordDraft}
                  onChange={event => setKeywordDraft(event.target.value)}
                  placeholder="搜索课程标题或摘要"
                  className="w-full bg-transparent text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setKeyword(keywordDraft.trim());
                  setSearchOpen(false);
                }}
                className="text-sm font-black text-rose-500"
              >
                搜索
              </button>
            </div>

            <div className="px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setKeywordDraft("");
                  setSearchOpen(false);
                }}
                className="text-xs font-bold text-gray-400"
              >
                清空搜索
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSheet && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setActiveSheet(null)}>
          <div className="mx-auto h-full w-full max-w-[420px] relative" onClick={event => event.stopPropagation()}>
            <div className="absolute inset-x-0 bottom-0 rounded-t-[32px] bg-white px-6 pt-5 pb-8 shadow-[0_-12px_30px_rgba(15,23,42,0.12)]">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200" />
              <div className="mt-4 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">{getSheetTitle(activeSheet)}</h2>
                <button
                  type="button"
                  onClick={() => setActiveSheet(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-gray-500"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mt-5 space-y-2">
                {getSheetOptions(activeSheet).map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    option.onSelect();
                    setActiveSheet(null);
                  }}
                  className={
                    option.selected
                      ? "flex w-full items-center justify-between rounded-2xl bg-gray-900 px-4 py-4 text-sm font-black text-white"
                      : "flex w-full items-center justify-between rounded-2xl bg-rose-50/70 px-4 py-4 text-sm font-bold text-gray-700"
                  }
                >
                  <span>{option.label}</span>
                  {option.selected && <span className="text-xs font-black">当前</span>}
                </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getSheetOptions(sheet: FilterSheet) {
    if (sheet === "status") {
      return [
        { value: "all", label: "全部", selected: statusFilter === "all", onSelect: () => setStatusFilter("all") },
        { value: "not_started", label: "未学习", selected: statusFilter === "not_started", onSelect: () => setStatusFilter("not_started") },
        { value: "in_progress", label: "学习中", selected: statusFilter === "in_progress", onSelect: () => setStatusFilter("in_progress") },
        { value: "completed", label: "已学习", selected: statusFilter === "completed", onSelect: () => setStatusFilter("completed") }
      ];
    }

    if (sheet === "source") {
      return [
        { value: "all", label: "全部", selected: sourceFilter === "all", onSelect: () => setSourceFilter("all") },
        { value: "national", label: "全国", selected: sourceFilter === "national", onSelect: () => setSourceFilter("national") },
        { value: "regional", label: "区域", selected: sourceFilter === "regional", onSelect: () => setSourceFilter("regional") }
      ];
    }

    return [
      { value: "newest", label: "由新到旧", selected: sortOrder === "newest", onSelect: () => setSortOrder("newest") },
      { value: "oldest", label: "由旧到新", selected: sortOrder === "oldest", onSelect: () => setSortOrder("oldest") }
    ];
  }
}

function FilterChip({
  label,
  active = false,
  icon,
  onClick
}: {
  label: string;
  active?: boolean;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-[11px] font-black text-white"
          : "flex shrink-0 items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2.5 text-[11px] font-bold text-gray-600"
      }
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function getStatusLabel(value: CourseStatusFilter) {
  if (value === "not_started") return "未学习";
  if (value === "in_progress") return "学习中";
  if (value === "completed") return "已学习";
  return "学习状态";
}

function getSourceLabel(value: CourseSourceFilter) {
  if (value === "national") return "全国";
  if (value === "regional") return "区域";
  return "来源";
}

function getSortLabel(value: CourseSortOrder) {
  return value === "oldest" ? "由旧到新" : "由新到旧";
}

function getSheetTitle(sheet: FilterSheet) {
  if (sheet === "status") return "学习状态";
  if (sheet === "source") return "来源";
  return "排序";
}
