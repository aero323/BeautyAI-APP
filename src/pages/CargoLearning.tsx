import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Clock3, FileSpreadsheet, FileText, Globe2, PlayCircle, Presentation, Search } from "lucide-react";
import { cargoCourses } from "../cargo/data";
import { learningCategoryLabels, learningFormatLabels, learningResources, type LearningCategory, type LearningFormat } from "../cargo/learningResources";
import { Pill } from "../cargo/components";
import pdaScanCover from "../assets/learning-covers/pda-scan-course.webp";
import signFailureCover from "../assets/learning-covers/sign-failure-course.webp";
import returnReviewCover from "../assets/learning-covers/return-review-course.webp";

const categories = Object.entries(learningCategoryLabels) as [LearningCategory, string][];

export function CargoLearning() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const categoryParam = searchParams.get("category");
  const category: LearningCategory = categories.some(([id]) => id === categoryParam) ? categoryParam as LearningCategory : "ai_class";
  const resources = useMemo(() => learningResources.filter(item => (
    item.category === category && (!query || item.title.includes(query) || item.summary.includes(query))
  )), [category, query]);

  return (
    <div className="min-h-full bg-background">
      <header className="bg-white px-5 pb-5 pt-12">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Learning Center</p>
        <h1 className="mt-1 text-2xl font-black text-gray-950">学习中心</h1>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3">
          <Search size={17} className="text-gray-400" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索课程和学习资料" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(([id, label]) => (
            <Link
              key={id}
              to={id === "ai_class" ? "/learning" : `/learning?category=${id}`}
              aria-current={category === id ? "page" : undefined}
              className={`tap rounded-full border px-3.5 py-2 text-[11px] font-black transition-colors ${category === id ? "border-primary bg-primary text-white shadow-sm" : "border-gray-200 bg-white text-gray-500"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </header>

      <div className="page-x py-5">
        {category === "ai_class" ? <AiClassroom query={query} /> : <ResourceList items={resources} category={category} />}
      </div>
    </div>
  );
}

function AiClassroom({ query }: { query: string }) {
  const courses = cargoCourses.filter(course => !query || course.title.includes(query) || course.description.includes(query));
  return <CourseList courses={courses} />;
}

const courseCovers: Record<string, string> = {
  "course-scan-correction": pdaScanCover,
  "course-sign-failure": signFailureCover,
  "course-return-risk": returnReviewCover
};

function CourseList({ courses }: { courses: typeof cargoCourses }) {
  if (!courses.length) return <EmptyResult />;
  return (
    <div className="space-y-3">
      {courses.map(course => (
        <Link key={course.id} to={`/course/${course.id}`} className="tap card block overflow-hidden">
          <div className="aspect-[16/7] overflow-hidden bg-gray-100">
            <img src={courseCovers[course.id]} alt={`${course.title}课程配图`} className="h-full w-full object-cover" />
          </div>
          <div className="p-4">
            <Pill tone="red">{course.tag}</Pill>
            <h3 className="mt-2.5 text-base font-black text-gray-900">{course.title}</h3>
            <p className="mt-1.5 text-[11px] leading-5 text-gray-500">{course.description}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-gray-400">
              <Clock3 size={12} />
              <span>预计 {course.duration}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ResourceList({ items, category }: { items: typeof learningResources; category: LearningCategory }) {
  if (!items.length) return <EmptyResult />;
  return (
    <div>
      <div className="mb-3 flex items-end justify-between"><div><p className="text-[10px] font-bold text-gray-400">学习资料</p><h2 className="mt-0.5 text-base font-black text-gray-900">{learningCategoryLabels[category]}</h2></div><span className="text-[10px] text-gray-400">共 {items.length} 项</span></div>
      <div className="space-y-3">
        {items.map(item => (
          <Link key={item.id} to={`/learning/resource/${item.id}`} className="tap card block p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-red-50 text-primary"><FormatIcon format={item.format} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5"><Pill tone="red">{learningFormatLabels[item.format]}</Pill><span className="text-[10px] text-gray-400">应用内预览</span></div>
                <h3 className="mt-2 text-sm font-black text-gray-900">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-gray-500">{item.summary}</p>
                <p className="mt-2 text-[10px] text-gray-400">{item.updatedAt} · {item.source} · {item.readTime}</p>
              </div>
              <ChevronRight size={17} className="mt-1 flex-none text-gray-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FormatIcon({ format }: { format: LearningFormat }) {
  if (format === "EXCEL") return <FileSpreadsheet size={20} />;
  if (format === "PPT") return <Presentation size={20} />;
  if (format === "WEB") return <Globe2 size={20} />;
  if (format === "VIDEO") return <PlayCircle size={20} />;
  return <FileText size={20} />;
}

function EmptyResult() {
  return <div className="card px-6 py-10 text-center"><Search size={24} className="mx-auto text-gray-300" /><p className="mt-3 text-sm font-black text-gray-700">未找到相关内容</p><p className="mt-1 text-[11px] text-gray-400">换个关键词试试看</p></div>;
}
