export type Severity = "high" | "medium" | "low";

export interface CargoUser {
  id: string;
  name: string;
  employeeNo: string;
  role: string;
  station: string;
  department: string;
  region: string;
  country: string;
  avatarUrl: string;
}

export interface BusinessEvent {
  id: string;
  type: "scan_error" | "delivery_failed" | "return_violation" | "inventory";
  title: string;
  summary: string;
  severity: Severity;
  status: "pending" | "processing" | "resolved";
  time: string;
  waybill?: string;
  errorCode?: string;
  planId?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: "SOP" | "制度" | "操作手册" | "视频";
  format: "PDF" | "PPT" | "VIDEO" | "FEISHU";
  version: string;
  updatedAt: string;
  validUntil: string;
  source: string;
  permission: string;
  summary: string;
  location: string;
  videoTime?: number;
}

export interface CargoCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: "PPT讲课" | "视频" | "图文";
  progress: number;
  tag: string;
  planId?: string;
}

export interface TrainingStage {
  id: "event" | "course" | "practice" | "exam" | "retrain" | "complete";
  title: string;
  description: string;
  route?: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  reason: string;
  dueText: string;
  eventId: string;
  progress: number;
  stages: TrainingStage[];
}

export interface CargoNotification {
  id: string;
  type: "event" | "course" | "exam" | "retrain" | "reward";
  title: string;
  body: string;
  time: string;
  route: string;
}

export interface PointEntry {
  id: string;
  title: string;
  detail: string;
  date: string;
  points: number;
}

export interface RankingRow {
  rank: number;
  name: string;
  org: string;
  points: number;
  isMe?: boolean;
}

export const cargoUsers: CargoUser[] = [
  {
    id: "courier-shenzhen",
    name: "Budi Santoso",
    employeeNo: "JTID07521",
    role: "Kurir",
    station: "Jakarta Selatan Hub",
    department: "Jakarta Selatan 1",
    region: "Jabodetabek",
    country: "Indonesia",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=BudiSantoso"
  },
  {
    id: "courier-guangzhou",
    name: "Siti Rahma",
    employeeNo: "JTID06108",
    role: "Kurir",
    station: "Jakarta Barat Hub",
    department: "Jakarta Barat 3",
    region: "Jabodetabek",
    country: "Indonesia",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SitiRahma"
  },
  {
    id: "courier-hangzhou",
    name: "Andi Pratama",
    employeeNo: "JTID03266",
    role: "Operator",
    station: "Bandung Timur Hub",
    department: "Bandung Operasional",
    region: "Jawa Barat",
    country: "Indonesia",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AndiPratama"
  }
];

export const businessEvents: BusinessEvent[] = [
  {
    id: "event-pda-001",
    type: "scan_error",
    title: "PDA 错扫异常",
    summary: "派件扫描误选为问题件，请在今日内完成处理与专项培训。",
    severity: "high",
    status: "pending",
    time: "今天 09:18",
    waybill: "JT3049827156",
    errorCode: "E-SCAN-102",
    planId: "plan-pda-001"
  },
  {
    id: "event-sign-002",
    type: "delivery_failed",
    title: "签收失败待复核",
    summary: "收件人联系方式无效，系统建议核对三方信息后重新派送。",
    severity: "medium",
    status: "processing",
    time: "昨天 17:46",
    waybill: "JT3049713380"
  },
  {
    id: "event-return-003",
    type: "return_violation",
    title: "退件操作提醒",
    summary: "退回前未完成二次联系记录，请复习违规退件 SOP。",
    severity: "low",
    status: "resolved",
    time: "7月27日 14:20"
  }
];

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "doc-scan-sop",
    title: "PDA 扫描异常处理 SOP",
    category: "SOP",
    format: "PDF",
    version: "V3.2",
    updatedAt: "2026-07-18",
    validUntil: "2027-01-31",
    source: "飞书知识库同步",
    permission: "Jabodetabek 区域可见",
    summary: "覆盖错扫、漏扫、重复扫描、网络异常及异常件登记的标准处理步骤。",
    location: "第 12 页 · 3.2 错扫处理"
  },
  {
    id: "doc-sign-failed",
    title: "派件签收失败处理规范",
    category: "操作手册",
    format: "PPT",
    version: "V2.6",
    updatedAt: "2026-07-08",
    validUntil: "2026-12-31",
    source: "运营中心发布",
    permission: "全国可见",
    summary: "说明电话无人接听、地址异常、拒收等场景的联系、留痕和复派要求。",
    location: "第 18 页 · 联系失败"
  },
  {
    id: "video-pda-demo",
    title: "PDA 异常件登记演示",
    category: "视频",
    format: "VIDEO",
    version: "V1.4",
    updatedAt: "2026-07-20",
    validUntil: "2027-03-01",
    source: "培训中心视频库",
    permission: "全国可见",
    summary: "通过真实操作演示异常件登记、照片上传和处理结果回传。",
    location: "01:35 · 重新扫描入口",
    videoTime: 95
  },
  {
    id: "doc-return-policy",
    title: "违规退件判定与申诉规则",
    category: "制度",
    format: "FEISHU",
    version: "V4.0",
    updatedAt: "2026-07-25",
    validUntil: "2027-07-25",
    source: "飞书制度中心",
    permission: "网点负责人及收派员",
    summary: "解释违规退件判定条件、联系留痕、申诉材料和处理时效。",
    location: "第 4 节 · 违规情形"
  }
];

export const cargoCourses: CargoCourse[] = [
  {
    id: "course-scan-correction",
    title: "PDA 错扫纠正专项课",
    description: "掌握错扫识别、撤销、重新扫描和异常上报的标准操作。",
    duration: "10 分钟",
    format: "PPT讲课",
    progress: 35,
    tag: "SOP",
    planId: "plan-pda-001"
  },
  {
    id: "course-sign-failure",
    title: "签收失败的四步处理法",
    description: "覆盖联系留痕、地址核验、复派预约和异常登记。",
    duration: "14 分钟",
    format: "视频",
    progress: 0,
    tag: "服务规范"
  },
  {
    id: "course-return-risk",
    title: "违规退件风险速查",
    description: "通过真实案例辨别可退件、需复派和需升级处理的场景。",
    duration: "8 分钟",
    format: "图文",
    progress: 100,
    tag: "合规案例"
  }
];

export const trainingPlans: TrainingPlan[] = [
  {
    id: "plan-pda-001",
    title: "PDA 错扫专项提升计划",
    reason: "因 7 月 29 日 E-SCAN-102 错扫事件自动推荐",
    dueText: "今天 20:00 前完成",
    eventId: "event-pda-001",
    progress: 40,
    stages: [
      { id: "event", title: "事件识别", description: "系统识别一次派件错扫异常" },
      { id: "course", title: "专项课程", description: "完成《PDA 错扫纠正专项课》", route: "/course/course-scan-correction" },
      { id: "practice", title: "场景模拟", description: "完成 PDA 错扫处理场景模拟", route: "/practice/pda-scan" },
      { id: "exam", title: "专项考试", description: "80 分通过，未通过将自动补训", route: "/exam/pda-scan" },
      { id: "retrain", title: "补训与重考", description: "复习易错 SOP 后再次考试", route: "/course/course-scan-correction?retrain=1" },
      { id: "complete", title: "计划完成", description: "学习结果回传并获得 120 积分" }
    ]
  }
];

export const cargoNotifications: CargoNotification[] = [
  { id: "notice-1", type: "event", title: "检测到 PDA 错扫异常", body: "运单 JT3049827156 需要处理，并已生成专项培训。", time: "5分钟前", route: "/events/event-pda-001" },
  { id: "notice-2", type: "course", title: "已生成专项培训计划", body: "请在今日 20:00 前完成专项课程、场景模拟和考试。", time: "8分钟前", route: "/plans/plan-pda-001" },
  { id: "notice-3", type: "exam", title: "考试提醒", body: "《签收失败规范》考试将在明天到期。", time: "昨天", route: "/exam/pda-scan" },
  { id: "notice-4", type: "reward", title: "连续学习奖励到账", body: "连续学习 7 天，获得 30 积分。", time: "7月28日", route: "/points" }
];

export const basePointEntries: PointEntry[] = [
  { id: "point-1", title: "连续学习 7 天", detail: "连续学习奖励", date: "7月28日", points: 30 },
  { id: "point-2", title: "违规退件风险速查", detail: "完成课程", date: "7月27日", points: 20 },
  { id: "point-3", title: "签收失败处理考试", detail: "考试通过", date: "7月26日", points: 60 },
  { id: "point-4", title: "异常件登记不完整", detail: "业务规则扣分", date: "7月24日", points: -10 }
];

export const rankingData: Record<"department" | "region" | "national", RankingRow[]> = {
  department: [
    { rank: 1, name: "Dewi Lestari", org: "Jakarta Selatan 1", points: 986 },
    { rank: 2, name: "Budi Santoso", org: "Jakarta Selatan 1", points: 928, isMe: true },
    { rank: 3, name: "Rizky Maulana", org: "Jakarta Selatan 1", points: 901 },
    { rank: 4, name: "Agus Setiawan", org: "Jakarta Selatan 1", points: 875 }
  ],
  region: [
    { rank: 1, name: "Jakarta Selatan Hub", org: "Jabodetabek", points: 18360 },
    { rank: 2, name: "Jakarta Barat Hub", org: "Jabodetabek", points: 17680, isMe: true },
    { rank: 3, name: "Bekasi Timur Hub", org: "Jabodetabek", points: 16940 }
  ],
  national: [
    { rank: 1, name: "Jakarta Selatan Hub", org: "Jabodetabek", points: 32880 },
    { rank: 2, name: "Budi Santoso", org: "Jabodetabek", points: 17680, isMe: true },
    { rank: 3, name: "Surabaya Pusat Hub", org: "Jawa Timur", points: 17120 }
  ]
};

export const assistantSuggestions = [
  "PDA 错扫后怎么撤销？",
  "收件人电话打不通可以直接退件吗？",
  "异常件照片需要拍哪些内容？"
];
