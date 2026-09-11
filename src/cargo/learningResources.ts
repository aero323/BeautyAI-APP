export type LearningCategory = "ai_class" | "policy" | "manual" | "video" | "faq" | "case" | "notice";
export type LearningFormat = "WORD" | "PDF" | "PPT" | "EXCEL" | "WEB" | "VIDEO";

export interface LearningResource {
  id: string;
  category: Exclude<LearningCategory, "ai_class">;
  title: string;
  summary: string;
  format: LearningFormat;
  version: string;
  updatedAt: string;
  source: string;
  readTime: string;
}

export const learningResources: LearningResource[] = [
  {
    id: "policy-courier-compliance",
    category: "policy",
    title: "收派业务合规管理制度",
    summary: "明确收件、派件、签收、退件等关键环节的红线要求与责任边界。",
    format: "PDF",
    version: "V4.1",
    updatedAt: "7月28日",
    source: "运营管理中心",
    readTime: "12 分钟"
  },
  {
    id: "policy-return-appeal",
    category: "policy",
    title: "违规退件判定与申诉规则",
    summary: "在线查看违规退件判定条件、联系留痕要求和申诉处理时效。",
    format: "WEB",
    version: "V4.0",
    updatedAt: "7月25日",
    source: "飞书制度中心",
    readTime: "8 分钟"
  },
  {
    id: "manual-pda-operations",
    category: "manual",
    title: "PDA 扫描设备操作手册",
    summary: "覆盖设备登录、运单扫描、节点撤销、异常上报和离线处理。",
    format: "WORD",
    version: "V3.6",
    updatedAt: "7月22日",
    source: "信息技术中心",
    readTime: "15 分钟"
  },
  {
    id: "manual-sign-failure",
    category: "manual",
    title: "签收失败标准处理流程",
    summary: "通过演示文稿说明联系留痕、地址核验、预约复派与异常登记。",
    format: "PPT",
    version: "V2.6",
    updatedAt: "7月18日",
    source: "培训中心",
    readTime: "10 分钟"
  },
  {
    id: "video-pda-exception",
    category: "video",
    title: "PDA 异常件登记视频教程",
    summary: "演示异常照片上传、错误节点撤销和处理结果回传。",
    format: "VIDEO",
    version: "V1.4",
    updatedAt: "7月20日",
    source: "培训中心视频库",
    readTime: "6 分钟"
  },
  {
    id: "video-damage-photo",
    category: "video",
    title: "破损件现场拍照教程",
    summary: "学习外包装、面单、破损位置和现场全景的规范拍摄方法。",
    format: "VIDEO",
    version: "V1.2",
    updatedAt: "7月16日",
    source: "品质管理部",
    readTime: "4 分钟"
  },
  {
    id: "faq-error-codes",
    category: "faq",
    title: "PDA 常见错误码 FAQ",
    summary: "按错误码查询问题含义、排查方法、处理入口和升级部门。",
    format: "EXCEL",
    version: "2026.07",
    updatedAt: "7月29日",
    source: "服务支持台",
    readTime: "随查随用"
  },
  {
    id: "faq-delivery",
    category: "faq",
    title: "派件常见问题在线答疑",
    summary: "集中解答电话无人接听、地址不详、客户拒收和预约复派问题。",
    format: "WEB",
    version: "持续更新",
    updatedAt: "今天",
    source: "业务知识中心",
    readTime: "5 分钟"
  },
  {
    id: "case-scan-review",
    category: "case",
    title: "E-SCAN-102 错扫事件复盘",
    summary: "复盘一次派件节点错扫的发现、处置、培训和预防全过程。",
    format: "PPT",
    version: "案例 2026-018",
    updatedAt: "7月27日",
    source: "Jabodetabek 区域运营",
    readTime: "8 分钟"
  },
  {
    id: "case-return-success",
    category: "case",
    title: "违规退件申诉成功案例",
    summary: "通过完整联系留痕与现场证据还原申诉成功的关键材料。",
    format: "PDF",
    version: "案例 2026-012",
    updatedAt: "7月21日",
    source: "品质管理部",
    readTime: "7 分钟"
  },
  {
    id: "notice-scan-update",
    category: "notice",
    title: "7 月扫描规范更新通知",
    summary: "新增错扫撤销原因选择要求，并调整异常件照片上传规范。",
    format: "WORD",
    version: "公告 2026-0728",
    updatedAt: "7月28日",
    source: "运营管理中心",
    readTime: "3 分钟"
  },
  {
    id: "notice-pda-release",
    category: "notice",
    title: "新版 PDA 功能上线公告",
    summary: "新版增加轨迹核验、错扫撤销和异常回传状态查询能力。",
    format: "WEB",
    version: "5.8.0",
    updatedAt: "7月26日",
    source: "信息技术中心",
    readTime: "4 分钟"
  }
];

export const learningCategoryLabels: Record<LearningCategory, string> = {
  ai_class: "AI课堂",
  policy: "制度规范",
  manual: "操作手册",
  video: "视频教程",
  faq: "FAQ",
  case: "历史案例",
  notice: "公告通知"
};

export const learningFormatLabels: Record<LearningFormat, string> = {
  WORD: "Word",
  PDF: "PDF",
  PPT: "PPT",
  EXCEL: "Excel",
  WEB: "网页",
  VIDEO: "视频"
};
