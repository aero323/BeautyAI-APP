import { BookOpen } from "lucide-react";

export function Course() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-8 pt-10 px-6 items-center justify-center">
      <div className="bg-white rounded-full p-6 shadow-[0_4px_20px_rgba(244,63,94,0.05)] border border-pink-50 mb-6">
        <BookOpen size={48} className="text-gray-300" />
      </div>
      <h1 className="text-xl font-black text-gray-800 tracking-tight text-center">Course Content</h1>
      <p className="text-sm text-gray-500 mt-2 text-center max-w-[260px]">
        This section is currently under construction. Please check back later for new course materials.
      </p>
    </div>
  );
}
