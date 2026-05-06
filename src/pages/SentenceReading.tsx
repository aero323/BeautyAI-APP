import { useState } from "react";
import { ArrowLeft, Play, Mic, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const sentences = [
  {
    en: "This serum contains <span class='text-rose-500 underline decoration-rose-200'>5% Niacinamide</span> which helps brighten skin in <span class='text-rose-500 underline decoration-rose-200'>2 weeks</span>...",
    zh: "这款精华含有5%烟酰胺，能够帮助在2周内提亮肤色",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
  },
  {
    en: "It features <span class='text-rose-500 underline decoration-rose-200'>Centella Asiatica</span> to soothe redness and repair the <span class='text-rose-500 underline decoration-rose-200'>skin barrier</span>.",
    zh: "它含有积雪草成分，可舒缓泛红并修复肌肤屏障。",
    img: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
  },
  {
    en: "Apply <span class='text-rose-500 underline decoration-rose-200'>2-3 drops</span> every morning and night before your <span class='text-rose-500 underline decoration-rose-200'>moisturizer</span>.",
    zh: "每天早晚在面霜前使用2-3滴。",
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
  },
  {
    en: "The <span class='text-rose-500 underline decoration-rose-200'>lightweight texture</span> absorbs almost instantly without any <span class='text-rose-500 underline decoration-rose-200'>sticky residue</span>.",
    zh: "轻盈质地几乎能瞬间被吸收，且不觉得粘腻。",
    img: "https://images.unsplash.com/photo-1571781564993-9426f4fcae12?auto=format&fit=crop&w=800&q=80"
  },
  {
    en: "It's highly recommended for <span class='text-rose-500 underline decoration-rose-200'>sensitive skin types</span> looking for <span class='text-rose-500 underline decoration-rose-200'>safe brightening</span>.",
    zh: "强烈推荐给寻求安全美白方案的敏感肌人群。",
    img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"
  }
];

export function SentenceReading() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceCounts, setPracticeCounts] = useState<number[]>(sentences.map(() => 0));
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    // Swipe UP (next)
    if (diff > 50 && currentIndex < sentences.length - 1) {
       setDirection(1);
       setCurrentIndex(prev => prev + 1);
    } 
    // Swipe DOWN (prev)
    else if (diff < -50 && currentIndex > 0) {
       setDirection(-1);
       setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRecordComplete = () => {
    setIsRecording(false);
    const newCounts = [...practiceCounts];
    newCounts[currentIndex] += 1;
    setPracticeCounts(newCounts);
  };

  const currentSentence = sentences[currentIndex];
  const count = practiceCounts[currentIndex];

  return (
    <div 
      className="absolute inset-0 pb-20 bg-rose-50 text-gray-800 overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => setTouchStart(e.clientY)}
      onMouseUp={(e) => {
        const touchEnd = e.clientY;
        const diff = touchStart - touchEnd;
        if (diff > 50 && currentIndex < sentences.length - 1) {
           setDirection(1);
           setCurrentIndex(prev => prev + 1);
        } else if (diff < -50 && currentIndex > 0) {
           setDirection(-1);
           setCurrentIndex(prev => prev - 1);
        }
      }}
    >
      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pt-10 pointer-events-none">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 pointer-events-auto">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/30 text-white">
          <span className="text-[10px] bg-white text-rose-600 px-1.5 py-0.5 rounded-full font-bold italic mr-1 shadow-sm">Sentence of Day</span>
        </div>
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
           key={currentIndex}
           custom={direction}
           variants={{
             enter: (dir) => ({ y: dir > 0 ? "100%" : "-100%" }),
             center: { y: 0 },
             exit: (dir) => ({ y: dir > 0 ? "-20%" : "20%", opacity: 0 }),
           }}
           initial="enter"
           animate="center"
           exit="exit"
           transition={{ duration: 0.4, ease: "circOut" }}
           className="w-full h-full flex flex-col absolute inset-0"
        >
          {/* Img Header */}
          <div className="relative h-[45%] w-full rounded-b-[48px] overflow-hidden shadow-sm shrink-0">
            <img 
              src={currentSentence.img} 
              alt="Product"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 -mt-20 relative z-10 flex flex-col justify-between pb-6">
            <div className="space-y-4 bg-white/90 backdrop-blur-md p-6 rounded-[32px] shadow-sm border border-white/60">
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <span>Progress {currentIndex + 1}/{sentences.length}</span>
                <span className="text-rose-500">Practice #{count}</span>
              </div>
              
              <p 
                className="text-xl font-black leading-relaxed italic text-gray-800"
                dangerouslySetInnerHTML={{ __html: currentSentence.en }}
              />
              <p className="text-xs text-gray-400 font-medium pt-2 border-t border-gray-100">
                "{currentSentence.zh}"
              </p>
            </div>

            {/* Controls */}
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
                  onMouseLeave={() => { if(isRecording) handleRecordComplete(); }}
                  onTouchStart={(e) => { e.stopPropagation(); setIsRecording(true); }}
                  onTouchEnd={(e) => { e.stopPropagation(); handleRecordComplete(); }}
                  className={`flex flex-col items-center gap-2 transition-transform pointer-events-auto ${
                    isRecording ? "scale-105" : ""
                  }`}
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors border-4 border-white ${
                    isRecording ? "bg-red-500 shadow-red-200" : "bg-gradient-to-r from-pink-500 to-rose-400 shadow-rose-200"
                  }`}>
                    <Mic size={36} className="text-white" />
                  </div>
                  <span className={`text-[11px] font-bold ${isRecording ? 'text-red-500' : 'text-rose-600'}`}>
                    {isRecording ? "Recording..." : "Hold to Read"}
                  </span>
                </button>
                
                <div className="w-14 opacity-0 pointer-events-none"></div>
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
