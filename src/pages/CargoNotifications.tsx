import { useNavigate } from "react-router-dom";
import { Award, BellRing, BookOpen, CircleAlert, ClipboardCheck } from "lucide-react";
import { PageHeader, Pill } from "../cargo/components";
import { useCargo } from "../cargo/CargoContext";
import { cargoNotifications } from "../cargo/data";

const icons = {
  event: CircleAlert,
  course: BookOpen,
  exam: ClipboardCheck,
  retrain: BellRing,
  reward: Award
};

export function CargoNotifications() {
  const navigate = useNavigate();
  const { readNotifications, markNotificationRead } = useCargo();
  return (
    <div className="min-h-full bg-background">
      <PageHeader title="消息中心" subtitle="异常、培训与学习奖励" />
      <div className="page-x space-y-3 py-5">
        {cargoNotifications.map(item => {
          const Icon = icons[item.type];
          const unread = !readNotifications.includes(item.id);
          return (
            <button key={item.id} onClick={() => { markNotificationRead(item.id); navigate(item.route); }} className="tap card flex w-full items-start gap-3 p-4 text-left">
              <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl ${unread ? "bg-red-50 text-primary" : "bg-gray-100 text-gray-400"}`}><Icon size={21} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2"><strong className="text-sm text-gray-900">{item.title}</strong>{unread && <Pill tone="red">未读</Pill>}</span>
                <span className="mt-1.5 block text-xs leading-5 text-gray-500">{item.body}</span>
                <span className="mt-2 block text-[10px] font-medium text-gray-400">{item.time}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
