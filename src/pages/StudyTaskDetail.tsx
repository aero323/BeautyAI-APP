import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { useMockAuth } from "../context/MockAuthContext";
import { getCourseUnitId } from "../data/mockData";

export function StudyTaskDetail() {
  const { missionId } = useParams();
  const { user, regionData, getMissionById, getNextStudyUnit } = useMockAuth();
  if (!user || !regionData) return null;

  const mission = getMissionById(Number(missionId));
  if (!mission?.studyTask) {
    return <Navigate to="/" replace />;
  }

  const completed = new Set(mission.completedUnitIds ?? []);
  const courseItems = mission.studyTask.courseIds
    .map(courseId => regionData.courses.find(course => course.id === courseId))
    .filter((course): course is NonNullable<typeof course> => Boolean(course));
  const nextCourseId = getNextStudyUnit(mission.id);
  const progressPercent = Math.min(100, Math.round((mission.progressCurrent / mission.progressTarget) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="px-6 py-6 pb-8 bg-white rounded-b-[48px] shadow-sm border-b border-pink-100">
        <Link to="/" className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 mt-8">
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400">Study Task</p>
          <h1 className="mt-2 text-2xl font-black text-gray-800 tracking-tight">{mission.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-500">{mission.sourceLabel}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500">{mission.cycleLabel}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500">{mission.contentScope}</span>
          </div>
          <div className="mt-4 rounded-[28px] border border-pink-100 bg-rose-50/60 p-4">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1 text-gray-500"><Clock size={13} />{mission.dueText}</span>
              <span className="text-rose-500">{mission.progressCurrent}/{mission.progressTarget}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Link
          to={nextCourseId ? `/course?missionId=${mission.id}&courseId=${nextCourseId}` : "/course"}
          className="flex items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-pink-500 to-rose-400 py-4 text-sm font-black text-white shadow-lg shadow-rose-200"
        >
          <BookOpen size={16} />
          Continue Learning
        </Link>

        {courseItems.map(course => {
          const isDone = completed.has(getCourseUnitId(course.id));
          const isNext = nextCourseId === course.id;

          return (
            <CourseCard
              key={course.id}
              course={course}
              href={`/course?missionId=${mission.id}&courseId=${course.id}`}
              completed={isDone}
              highlighted={isNext}
            />
          );
        })}
      </div>
    </div>
  );
}
