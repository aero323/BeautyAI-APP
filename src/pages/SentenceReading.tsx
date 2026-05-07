import { useEffect, useMemo, useState, type TouchEvent } from "react";
import { ArrowLeft, ChevronUp, Mic, Play, Package, Tag } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useMockAuth } from "../context/MockAuthContext";
import { getPracticeUnitId } from "../data/mockData";

export function SentenceReading() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const sentenceId = Number(searchParams.get("sentenceId"));
  const { regionData, recordCompletion } = useMockAuth();
  const sentences = regionData?.sentences ?? [];
  const initialIndex = sentences.findIndex(item => item.id === sentenceId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [direction, setDirection] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceCounts, setPracticeCounts] = useState<number[]>(sentences.map(() => 0));
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    if (initialIndex >= 0) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex]);

  const currentSentence = sentences[currentIndex];
  const currentProduct = useMemo(() => {
    if (!currentSentence) return null;
    return {
      category: currentSentence.category,
      line: currentSentence.line,
      productName: currentSentence.productName,
      productDescription: currentSentence.productDescription,
      productImage: currentSentence.productImage,
      quote: currentSentence.quote,
      hint: currentSentence.hint,
      scope: currentSentence.scope,
      tagline: currentSentence.tagline
    };
  }, [currentSentence]);

  if (!currentSentence || !currentProduct) return null;
  const count = practiceCounts[currentIndex];

  const handleTouchStart = (e: TouchEvent) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchEnd = (e: TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientY;
    if (diff > 50 && currentIndex < sentences.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRecordComplete = () => {
    setIsRecording(false);
    const newCounts = [...practiceCounts];
    newCounts[currentIndex] += 1;
    setPracticeCounts(newCounts);
    const currentSentenceId = sentences[currentIndex]?.id;
    if (currentSentenceId) {
      recordCompletion("practice", undefined, getPracticeUnitId("sentence", currentSentenceId));
    }
  };

  return (
    <div
      className="absolute inset-0 pb-20 bg-rose-50 text-gray-800 overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => setTouchStart(e.clientY)}
      onMouseUp={(e) => {
        const diff = touchStart - e.clientY;
        if (diff > 50 && currentIndex < sentences.length - 1) {
          setDirection(1);
          setCurrentIndex(prev => prev + 1);
        } else if (diff < -50 && currentIndex > 0) {
          setDirection(-1);
          setCurrentIndex(prev => prev - 1);
        }
      }}
    >
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pt-10 pointer-events-none">
        <button
          onClick={() => {
            if (missionId) {
              navigate(`/tasks/practice/${missionId}`);
              return;
            }
            navigate(-1);
          }}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 pointer-events-auto"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/30 text-white">
          <span className="text-[10px] bg-white text-rose-600 px-1.5 py-0.5 rounded-full font-bold italic mr-1 shadow-sm">金句库练习</span>
        </div>
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={{
            enter: (dir) => ({ y: dir > 0 ? "100%" : "-100%" }),
            center: { y: 0 },
            exit: (dir) => ({ y: dir > 0 ? "-20%" : "20%", opacity: 0 })
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: "circOut" }}
          className="w-full h-full flex flex-col absolute inset-0"
        >
          <div className="relative h-[44%] w-full rounded-b-[48px] overflow-hidden shadow-sm shrink-0">
            <img src={currentProduct.productImage} alt={currentProduct.productName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute left-6 right-6 bottom-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold border border-white/20">
                  {currentProduct.scope}
                </span>
                <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold border border-white/20">
                  {currentProduct.category}
                </span>
              </div>
              <h2 className="text-2xl font-black leading-tight">{currentProduct.productName}</h2>
              <p className="text-xs mt-1 text-white/90 leading-relaxed">{currentProduct.productDescription}</p>
            </div>
          </div>

          <div className="flex-1 px-6 -mt-16 relative z-10 flex flex-col justify-between pb-6">
            <div className="space-y-4 bg-white/92 backdrop-blur-md p-5 rounded-[32px] shadow-sm border border-white/60">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-1.5"><Package size={12} className="text-rose-500" /> {currentProduct.line}</span>
                <span className="text-rose-500">Practice #{count}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-50 text-rose-600 px-3 py-1 text-[10px] font-bold">{currentProduct.tagline}</span>
                <span className="rounded-full bg-indigo-50 text-indigo-600 px-3 py-1 text-[10px] font-bold flex items-center gap-1">
                  <Tag size={11} /> {currentProduct.scope}
                </span>
              </div>

              <div>
                <p className="text-xl font-black leading-relaxed italic text-gray-800">{currentProduct.quote}</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-[11px] font-bold text-amber-700 mb-1">使用提示</p>
                <p className="text-[13px] leading-6 text-amber-900/80">{currentProduct.hint}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 mt-auto">
              {count > 0 && (
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <span>Great Job! ✅</span>
                  <span className="text-green-500 font-medium">| You've read it {count} times</span>
                </div>
              )}

              <div className="flex w-full justify-around items-center px-4">
                <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors pointer-events-auto">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 text-gray-500">
                    <Play size={20} className="ml-1" fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-bold">Listen</span>
                </button>

                <button
                  onMouseDown={(e) => { e.stopPropagation(); setIsRecording(true); }}
                  onMouseUp={(e) => { e.stopPropagation(); handleRecordComplete(); }}
                  onMouseLeave={() => { if (isRecording) handleRecordComplete(); }}
                  onTouchStart={(e) => { e.stopPropagation(); setIsRecording(true); }}
                  onTouchEnd={(e) => { e.stopPropagation(); handleRecordComplete(); }}
                  className={`flex flex-col items-center gap-2 transition-transform pointer-events-auto ${isRecording ? "scale-105" : ""}`}
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors border-4 border-white ${isRecording ? "bg-red-500 shadow-red-200" : "bg-gradient-to-r from-pink-500 to-rose-400 shadow-rose-200"}`}>
                    <Mic size={36} className="text-white" />
                  </div>
                  <span className={`text-[11px] font-bold ${isRecording ? 'text-red-500' : 'text-rose-600'}`}>
                    {isRecording ? "Recording..." : "Hold to Read"}
                  </span>
                </button>

                <div className="w-14 opacity-0 pointer-events-none" />
              </div>

              {currentIndex < sentences.length - 1 && (
                <div className="flex flex-col items-center gap-1 text-gray-400/60 animate-pulse mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Swipe Up</span>
                  <ChevronUp size={16} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
