import { useEffect, useRef, useState, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Check,
  ChevronRight,
  FileText,
  LoaderCircle,
  Mic,
  Paperclip,
  PlayCircle,
  RotateCcw,
  Send,
  ThumbsDown,
  ThumbsUp,
  UserRound
} from "lucide-react";
import { PageHeader } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import { assistantSuggestions, knowledgeDocuments } from "../cargo/data";

type ChatMessage = { id: string; role: "assistant" | "user"; text: string; attachment?: string };

const defaultMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "你好，我是 J&T 业务助手。你可以询问操作 SOP、异常处置和业务规则，也可以附上现场图片补充问题。"
  }
];

export function CargoAssistant() {
  const { user } = useCargo();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = user ? window.localStorage.getItem(`jt-cargo.chat.${user.id}`) : null;
    if (!saved) return defaultMessages;
    try {
      return (JSON.parse(saved) as ChatMessage[]).map(message => message.id === "welcome" ? defaultMessages[0] : message);
    } catch {
      return defaultMessages;
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [attachment, setAttachment] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) window.localStorage.setItem(`jt-cargo.chat.${user.id}`, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, user]);

  const sendMessage = (text = input) => {
    if (!text.trim() && !attachment) return;
    const nextUserMessage: ChatMessage = { id: `user-${Date.now()}`, role: "user", text: text || "请结合这张现场图片回答我的问题", attachment };
    setMessages(prev => [...prev, nextUserMessage]);
    setInput("");
    setAttachment(undefined);
    setLoading(true);
    window.setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: "根据《PDA 扫描异常处理 SOP》V3.2，错扫后应先停止继续操作，核对运单状态，再从扫描记录中撤销本次错误动作。若撤销入口不可用，需要登记异常件并上传现场照片。"
      }]);
      setLoading(false);
    }, 900);
  };

  const startVoice = () => {
    if (recording) return;
    setRecording(true);
    window.setTimeout(() => {
      setRecording(false);
      setInput("PDA 错扫后怎么撤销？");
    }, 1400);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <PageHeader title="业务助手" subtitle="操作规范与业务问答" />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message, index) => (
            <ChatBubble key={message.id} message={message} showAnswerCard={message.role === "assistant" && index > 0} />
          ))}
          {loading && <div className="flex items-center gap-3 text-xs text-gray-400"><span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-950 text-white"><Bot size={18} /></span><span className="card flex items-center gap-2 px-4 py-3"><LoaderCircle size={15} className="animate-spin text-primary" />正在检索最新有效知识...</span></div>}
          <div ref={bottomRef} />
        </div>
        <Composer input={input} setInput={setInput} attachment={attachment} setAttachment={setAttachment} fileRef={fileRef} recording={recording} startVoice={startVoice} send={() => sendMessage()} />
      </div>
    </div>
  );
}

function ChatBubble({ message, showAnswerCard }: { key?: string; message: ChatMessage; showAnswerCard: boolean }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"up" | "down">();
  const isUser = message.role === "user";
  const steps = ["立即停止当前扫描操作", "核对运单号与最新轨迹", "进入扫描记录撤销错扫", "重新选择正确节点完成扫描"];
  return (
    <div className={`flex max-w-[92%] gap-2.5 ${isUser ? "ml-auto flex-row-reverse" : ""}`}>
      <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-2xl ${isUser ? "bg-red-50 text-primary" : "bg-gray-950 text-white"}`}>{isUser ? <UserRound size={17} /> : <Bot size={17} />}</span>
      <div className="min-w-0 flex-1">
        <div className={`rounded-[22px] px-4 py-3 text-[13px] leading-6 ${isUser ? "rounded-tr-md bg-primary text-white" : "rounded-tl-md border border-gray-100 bg-white text-gray-700 shadow-sm"}`}>
          {message.attachment && <img src={message.attachment} alt="问题附件" className="mb-3 max-h-40 w-full rounded-2xl object-cover" />}
          {message.text}
        </div>
        {showAnswerCard && (
          <div className="mt-2 space-y-2">
            <div className="card overflow-hidden p-3">
              <p className="mb-2 text-[10px] font-black text-gray-400">建议操作步骤</p>
              {steps.map((step, index) => (
                <button key={step} onClick={() => setChecked(prev => prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index])} className="flex w-full items-center gap-2.5 py-2 text-left text-xs text-gray-700">
                  <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border ${checked.includes(index) ? "border-green-500 bg-green-500 text-white" : "border-gray-200"}`}>{checked.includes(index) && <Check size={12} />}</span>
                  {step}
                </button>
              ))}
            </div>
            <button onClick={() => navigate("/knowledge/doc-scan-sop?location=page-12")} className="tap card flex w-full items-center gap-3 p-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-primary"><FileText size={18} /></span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-xs">{knowledgeDocuments[0].title} · {knowledgeDocuments[0].version}</strong><span className="mt-0.5 block text-[10px] text-gray-400">第12页 · 更新于 2026-07-18</span></span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button onClick={() => navigate("/video/video-pda-demo?t=95")} className="tap card flex w-full items-center gap-3 p-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><PlayCircle size={18} /></span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-xs">视频定位：重新扫描入口</strong><span className="mt-0.5 block text-[10px] text-gray-400">从 01:35 开始播放</span></span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <div className="flex items-center gap-2 px-1 text-[10px] text-gray-400"><span>这个回答有帮助吗？</span><button onClick={() => setFeedback("up")} className={feedback === "up" ? "text-primary" : ""}><ThumbsUp size={14} /></button><button onClick={() => setFeedback("down")} className={feedback === "down" ? "text-primary" : ""}><ThumbsDown size={14} /></button>{feedback && <span className="text-green-600">已反馈</span>}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Composer({ input, setInput, attachment, setAttachment, fileRef, recording, startVoice, send }: { input: string; setInput: (value: string) => void; attachment?: string; setAttachment: (value?: string) => void; fileRef: RefObject<HTMLInputElement | null>; recording: boolean; startVoice: () => void; send: () => void }) {
  return (
    <div className="border-t border-gray-100 bg-white p-4 pb-safe">
      <label className="mb-2 flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2.5">
        <Bot size={16} className="flex-none text-primary" />
        <span className="flex-none text-[10px] font-black text-gray-500">常见业务问题</span>
        <select aria-label="常见业务问题" value="" onChange={event => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent text-right text-[11px] font-semibold text-gray-700 outline-none">
          <option value="">请选择</option>
          {assistantSuggestions.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      {attachment && <div className="mb-2 flex items-center gap-2 rounded-2xl bg-gray-50 p-2"><img src={attachment} alt="待发送附件" className="h-12 w-12 rounded-xl object-cover" /><span className="flex-1 text-xs text-gray-500">图片已添加，将作为问题补充一并发送</span><button onClick={() => setAttachment(undefined)} className="text-gray-400"><RotateCcw size={16} /></button></div>}
      {recording && <div className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-red-50 py-2 text-xs font-bold text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" />正在录音并识别...</div>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) setAttachment(URL.createObjectURL(file)); }} />
      <div className="flex items-end gap-2 rounded-[22px] border border-gray-200 bg-gray-50 p-2">
        <button onClick={() => fileRef.current?.click()} className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl text-gray-500 hover:bg-white"><Paperclip size={18} /></button>
        <textarea value={input} onChange={event => setInput(event.target.value)} placeholder="输入业务问题，或附上现场图片..." rows={1} className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-sm outline-none placeholder:text-gray-400" />
        <button onClick={startVoice} className={`flex h-10 w-10 flex-none items-center justify-center rounded-2xl ${recording ? "bg-red-50 text-primary" : "text-gray-500 hover:bg-white"}`}><Mic size={18} /></button>
        <button onClick={send} disabled={!input.trim() && !attachment} className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-30"><Send size={17} /></button>
      </div>
    </div>
  );
}
