export type RegionId = "jakarta" | "surabaya";

export interface MockUser {
  id: string;
  name: string;
  greetingName: string;
  regionId: RegionId;
  regionName: string;
  storeName: string;
  title: string;
  avatarSeed: string;
  avatarUrl?: string;
}

export interface Mission {
  id: number;
  title: string;
  type: "exam" | "course" | "practice";
  dueText: string;
  route: string;
  sourceId: number;
  status: "todo" | "in_progress" | "done" | "overdue";
  sourceLabel: string;
  cycleLabel: string;
  progressCurrent: number;
  progressTarget: number;
  contentScope: string;
  allowSharedCredit?: boolean;
  studyTask?: {
    courseIds: number[];
  };
  practiceTask?: {
    personaIds: number[];
    scenarioIds: number[];
    sentenceIds: number[];
    coverageTarget?: number;
  };
  completedUnitIds?: MissionUnitId[];
  coverageCurrent?: number;
  coverageTarget?: number;
}

export type MissionUnitKind = "course" | "persona" | "scenario" | "sentence";
export type MissionUnitId = `${MissionUnitKind}:${number}`;

export interface CourseItem {
  id: number;
  title: string;
  description: string;
  progress: number;
  duration: string;
  tag: string;
  source: "national" | "regional";
  sourceLabel: string;
  createdAt: string;
  coverLabel: string;
  coverGradient: string;
}

export interface PracticePersona {
  id: number;
  name: string;
  customerName: string;
  age: number;
  sceneLabel: string;
  tags: string[];
  focus: string;
  maxScore: number;
  practiceCount: number;
  avatarSeed: string;
  portraitImage?: string;
  description: string;
  color: "indigo" | "rose";
  firstMessage: string;
  followUpMessage: string;
  hint: string;
  sampleReply: string;
}

export interface ScenarioPractice {
  id: number;
  title: string;
  maxScore: number;
  practiceCount: number;
  firstMessage: string;
  followUpMessage: string;
  hintKeywords: string;
}

export interface ExamItem {
  id: number;
  title: string;
  status: "pending" | "completed" | "missed";
  questions: number;
  time: string;
  date: string;
  score?: number;
  topic: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface SentenceItem {
  id: number;
  category: string;
  line: string;
  productName: string;
  productDescription: string;
  productImage: string;
  quote: string;
  hint: string;
  scope: string;
  tagline: string;
  title: string;
  en: string;
  zh: string;
  img: string;
}

export interface LeaderboardItem {
  rank: number;
  name: string;
  region: string;
  score: number;
  isMe?: boolean;
}

export interface RegionDataset {
  assistantPrompt: string;
  assistantAnswer: string;
  assistantSource: string;
  missions: Mission[];
  courses: CourseItem[];
  personas: PracticePersona[];
  scenarios: ScenarioPractice[];
  exams: ExamItem[];
  sentences: SentenceItem[];
  stats: {
    studyHours: number;
    roleplayTimes: number;
    weeklyRank: number;
    taskCompletionRate: number;
    latestExamScore: number;
    totalCoursesStudied: number;
    totalPracticeTime: string;
    monthlyPracticeCount: number;
    regionRankTotal: number;
  };
  leaderboard: LeaderboardItem[];
}

export const mockUsers: MockUser[] = [
  {
    id: "jakarta-ba",
    name: "Ibu Sarah",
    greetingName: "Sarah",
    regionId: "jakarta",
    regionName: "雅加达大区",
    storeName: "Jakarta Central Store",
    title: "Top Beauty Advisor",
    avatarSeed: "Sarah",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: "surabaya-ba",
    name: "Mbak Rani",
    greetingName: "Rani",
    regionId: "surabaya",
    regionName: "泗水大区",
    storeName: "Surabaya Tunjungan Store",
    title: "Beauty Advisor",
    avatarSeed: "Rani",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rani"
  }
];

export const regionData: Record<RegionId, RegionDataset> = {
  jakarta: {
    assistantPrompt: "\"Ask me anything about the New Glow Serum...\"",
    assistantAnswer:
      "For Jakarta customers with sensitive skin who want brightening, recommend Centella Brightening Serum.\n\nKey Ingredients:\n- 5% Niacinamide for brightening\n- Centella Asiatica for redness relief\n\nSelling Point:\n'It is made for sensitive skin, so it brightens while Centella keeps the skin calm.'",
    assistantSource: "Source: Jakarta Product Manual v2.4 (Page 12)",
    missions: [
      { id: 1, title: "Sensitivity Skincare Quiz", type: "exam", dueText: "Ends in: 2h 45m", route: "/exam/intro/1", sourceId: 1, status: "todo", sourceLabel: "总部", cycleLabel: "一次性", progressCurrent: 0, progressTarget: 1, contentScope: "新品知识考核" },
      { id: 2, title: "Glow Serum Quick Course", type: "course", dueText: "Due today", route: "/tasks/study/2", sourceId: 2001, status: "in_progress", sourceLabel: "总部", cycleLabel: "今日", progressCurrent: 0, progressTarget: 2, contentScope: "2个必修课件", studyTask: { courseIds: [1, 2] } },
      { id: 3, title: "新品集中培训每日练习", type: "practice", dueText: "Tonight 23:59", route: "/tasks/practice/3", sourceId: 3001, status: "todo", sourceLabel: "总部", cycleLabel: "每日", progressCurrent: 0, progressTarget: 1, contentScope: "从指定练习池完成 1 次", allowSharedCredit: true, practiceTask: { personaIds: [1], scenarioIds: [1], sentenceIds: [1], coverageTarget: 0 } },
      { id: 4, title: "雅加达区域限定话术练习", type: "practice", dueText: "Sunday 23:59", route: "/tasks/practice/4", sourceId: 3002, status: "in_progress", sourceLabel: "雅加达大区", cycleLabel: "本周", progressCurrent: 1, progressTarget: 3, contentScope: "本周 3 次，覆盖 2 个必练单元", allowSharedCredit: true, practiceTask: { personaIds: [1], scenarioIds: [1], sentenceIds: [1, 2], coverageTarget: 2 }, completedUnitIds: [getPracticeUnitId("persona", 1)] },
      { id: 5, title: "敏感肌基础问候练习", type: "practice", dueText: "Completed today", route: "/tasks/practice/5", sourceId: 3003, status: "done", sourceLabel: "雅加达大区", cycleLabel: "每日", progressCurrent: 1, progressTarget: 1, contentScope: "已完成练习任务", practiceTask: { personaIds: [2], scenarioIds: [], sentenceIds: [], coverageTarget: 1 }, completedUnitIds: [getPracticeUnitId("persona", 2)], coverageCurrent: 1, coverageTarget: 1 }
    ],
    courses: [
      {
        id: 1,
        title: "Glow Serum Launch Essentials",
        description: "Core ingredients, claims, and objection handling for Jakarta high-traffic stores.",
        progress: 68,
        duration: "18 min",
        tag: "Required",
        source: "national",
        sourceLabel: "全国",
        createdAt: "2024-06-18",
        coverLabel: "新品精华上市课",
        coverGradient: "from-rose-200 via-pink-100 to-white"
      },
      {
        id: 2,
        title: "Sensitive Skin Consultation",
        description: "How to calm concerns and explain Centella-based repair benefits.",
        progress: 25,
        duration: "12 min",
        tag: "Practice",
        source: "regional",
        sourceLabel: "雅加达大区",
        createdAt: "2024-06-10",
        coverLabel: "敏感肌咨询 SOP",
        coverGradient: "from-indigo-200 via-sky-100 to-white"
      },
      {
        id: 3,
        title: "Luxury Counter Welcome Ritual",
        description: "First-minute greeting, posture, and consultation opening for premium counters.",
        progress: 0,
        duration: "9 min",
        tag: "Optional",
        source: "regional",
        sourceLabel: "雅加达大区",
        createdAt: "2024-06-24",
        coverLabel: "高端柜台迎宾",
        coverGradient: "from-amber-200 via-yellow-100 to-white"
      },
      {
        id: 4,
        title: "Anti-aging Serum Objection Handling",
        description: "How to answer price, efficacy, and texture concerns for anti-aging serum shoppers.",
        progress: 30,
        duration: "15 min",
        tag: "Optional",
        source: "national",
        sourceLabel: "全国",
        createdAt: "2024-06-21",
        coverLabel: "抗老精华异议处理",
        coverGradient: "from-violet-200 via-fuchsia-100 to-white"
      }
    ],
    personas: [
      {
        id: 1,
        name: "敏感肌咨询 (Ibu Sarah, 35岁)",
        customerName: "Ibu Sarah",
        age: 35,
        sceneLabel: "敏感肌场景",
        tags: ["35岁", "敏感肌", "易泛红", "谨慎购买"],
        focus: "肤质诊断、成分讲解、安抚",
        maxScore: 78,
        practiceCount: 2,
        avatarSeed: "Sarah",
        portraitImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
        description: "顾客皮肤敏感经常泛红，曾使用竞品出现不良反应，对新产品比较谨慎。",
        color: "indigo",
        firstMessage: "Mbak, saya mau tanya. Kulit saya sensitif dan sering kemerahan. Ada produk yang cocok nggak ya?\n(小姐，我想问一下。我的皮肤敏感经常泛红。有没有适合的产品？)",
        followUpMessage: "Hmm tapi saya pernah coba brand X dan malah tambah merah. Bedanya apa dengan produk ini?\n(嗯但我之前用过X品牌反而更红了。这个产品和那个有什么区别？)",
        hint: "先同理顾客的心情，讲解本产品核心成分为【积雪草】，与X品牌的成分不同，主打温和修护。",
        sampleReply: "Ibu, untuk kulit sensitif kami punya Centella Brightening Serum..."
      },
      {
        id: 2,
        name: "抗初老需求 (Mbak Rini, 28岁)",
        customerName: "Mbak Rini",
        age: 28,
        sceneLabel: "抗初老场景",
        tags: ["28岁", "细纹初现", "预算有限", "希望见效快"],
        focus: "挖掘潜在需求、痛点放大、连带推荐",
        maxScore: 92,
        practiceCount: 5,
        avatarSeed: "Rini",
        portraitImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
        description: "顾客想寻找能改善细纹的产品，预算有限，希望立竿见影的效果。",
        color: "rose",
        firstMessage: "Saya mulai lihat garis halus di sekitar mata. Ada produk yang cepat kelihatan hasilnya?",
        followUpMessage: "Kalau harus tambah eye cream juga, apakah tidak terlalu mahal?",
        hint: "先确认预算，再用套组价值解释眼周护理和精华搭配的必要性。",
        sampleReply: "Mbak Rini, untuk garis halus kita bisa mulai dari serum anti-aging..."
      }
    ],
    scenarios: [
      {
        id: 1,
        title: "Glow Serum「黄金六步推荐法」",
        maxScore: 72,
        practiceCount: 3,
        firstMessage: "你好，我想看看有没有适合夏天用的清爽一点的精华。",
        followUpMessage: "我是混合偏干的，但夏天T区比较容易出油。",
        hintKeywords: "肤质类型 / 使用习惯 / 期望效果"
      }
    ],
    exams: [
      {
        id: 1,
        title: "夏季防晒新品知识考核",
        status: "pending",
        questions: 20,
        time: "30分钟",
        date: "截止: 2024-06-30",
        topic: "Ingredients",
        question: "新款烟酰胺美白精华的核心成分浓度是多少？它在什么时间内可以达到明显的提亮效果？",
        options: ["3% 烟酰胺，4周内提亮", "5% 烟酰胺，2周内提亮", "10% 烟酰胺，1周内提亮", "2% 烟酰胺，8周内提亮"],
        answerIndex: 1
      },
      {
        id: 2,
        title: "王牌抗老精华核心卖点考核",
        status: "completed",
        score: 95,
        questions: 20,
        time: "15分钟",
        date: "2024-05-15",
        topic: "Anti-aging",
        question: "抗老精华的核心连带销售建议是什么？",
        options: ["单独销售精华", "搭配防晒和眼霜", "只推荐洁面", "推荐卸妆油"],
        answerIndex: 1
      },
      {
        id: 3,
        title: "敏感肌护理基础理论",
        status: "missed",
        questions: 10,
        time: "10分钟",
        date: "截止: 2024-05-01",
        topic: "Sensitive Skin",
        question: "敏感肌沟通时应优先强调什么？",
        options: ["高刺激焕肤", "温和修护", "快速剥脱", "强力去油"],
        answerIndex: 1
      }
    ],
    sentences: [
      {
        id: 1,
        category: "护肤品类",
        line: "Barrier Shield 屏障修护系列",
        productName: "BS B5高保湿面霜",
        productDescription: "主打高浓度维他命B5与神经酰胺，适合干敏皮在换季或激光术后使用。",
        productImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
        quote: "这瓶面霜就像给肌肤穿上了一层隐形的拉链防风衣，特别适合现在这种容易换季泛红的天气。",
        hint: "强调像衣服一样的保护感，适合秋冬 / 换季",
        scope: "HQ",
        tagline: "适合干敏皮、换季泛红、术后修护",
        title: "BS B5高保湿面霜",
        en: "This serum contains <span class='text-rose-500 underline decoration-rose-200'>5% Niacinamide</span> which helps brighten skin in <span class='text-rose-500 underline decoration-rose-200'>2 weeks</span>...",
        zh: "这款精华含有5%烟酰胺，能够帮助在2周内提亮肤色",
        img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        category: "护肤品类",
        line: "Barrier Shield 屏障修护系列",
        productName: "BS 急救舒缓精华",
        productDescription: "高频次安抚敏感泛红，质地轻薄。",
        productImage: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
        quote: "里面有黄金配比的神经酰胺，不是表面浮油，是真的能吃进皮肤里修护底子的。",
        hint: "强调成分，针对顾客觉得其他面霜浮油的痛点",
        scope: "雅加达区",
        tagline: "泛红安抚、轻薄修护、敏感肌友好",
        title: "BS 急救舒缓精华",
        en: "It features <span class='text-rose-500 underline decoration-rose-200'>Centella Asiatica</span> to soothe redness and repair the <span class='text-rose-500 underline decoration-rose-200'>skin barrier</span>.",
        zh: "它含有积雪草成分，可舒缓泛红并修复肌肤屏障。",
        img: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 3,
        category: "护肤品类",
        line: "Radiance 极光透亮系列",
        productName: "极光焕白精华液",
        productDescription: "阻断黑色素沉积，温和透亮。",
        productImage: "https://images.unsplash.com/photo-1601049368168-1e2c4a7d8b65?auto=format&fit=crop&w=800&q=80",
        quote: "这款更适合想要慢慢提亮但又怕刺激的顾客，属于温和透亮型。",
        hint: "强调温和提亮 / 不刺激 / 适合敏感顾客",
        scope: "全国",
        tagline: "温和透亮、提亮肤色、适合敏感顾客",
        title: "极光焕白精华液",
        en: "This serum supports a <span class='text-rose-500 underline decoration-rose-200'>gentle brightening</span> routine.",
        zh: "这款精华适合温和提亮的护肤路线。",
        img: "https://images.unsplash.com/photo-1601049368168-1e2c4a7d8b65?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 4,
        category: "彩妆品类",
        line: "Flawless 丝绒底妆系列",
        productName: "丝绒持妆粉底液",
        productDescription: "24小时长效贴合，打造高级哑光丝绒妆效。",
        productImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        quote: "上妆后会更像哑光丝绒妆效，适合长时间通勤不易脱妆。",
        hint: "强调持妆 / 哑光丝绒 / 通勤场景",
        scope: "HQ",
        tagline: "持妆底妆、哑光丝绒、通勤不脱妆",
        title: "丝绒持妆粉底液",
        en: "This foundation delivers a <span class='text-rose-500 underline decoration-rose-200'>velvet matte finish</span> for long wear.",
        zh: "这款粉底液适合长时间持妆，呈现丝绒哑光妆感。",
        img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      }
    ],
    stats: {
      studyHours: 128.5,
      roleplayTimes: 42,
      weeklyRank: 4,
      taskCompletionRate: 92,
      latestExamScore: 95,
      totalCoursesStudied: 42,
      totalPracticeTime: "12小时30分",
      monthlyPracticeCount: 42,
      regionRankTotal: 128
    },
    leaderboard: [
      { rank: 1, name: "Maria", region: "Jakarta Plaza Indonesia", score: 2840 },
      { rank: 3, name: "Juliette Tan", region: "Jakarta Grand Indonesia", score: 2590 },
      { rank: 4, name: "Ibu Sarah", region: "Jakarta Central Store", score: 2410, isMe: true }
    ]
  },
  surabaya: {
    assistantPrompt: "\"Ask me about barrier repair and humid-weather routines...\"",
    assistantAnswer:
      "For Surabaya customers, start with barrier repair and oil-water balance.\n\nKey Ingredients:\n- Ceramide complex for barrier repair\n- Aloe extract for soothing after sun exposure\n\nSelling Point:\n'It keeps the skin comfortable in humid weather without feeling heavy.'",
    assistantSource: "Source: Surabaya Regional Training Pack (Page 8)",
    missions: [
      { id: 11, title: "Barrier Repair Course", type: "course", dueText: "Due today", route: "/tasks/study/11", sourceId: 2011, status: "in_progress", sourceLabel: "泗水大区", cycleLabel: "今日", progressCurrent: 0, progressTarget: 2, contentScope: "2个必修课件", studyTask: { courseIds: [11, 12] } },
      { id: 12, title: "Humid Weather Consultation Drill", type: "practice", dueText: "Ends in: 5h 10m", route: "/tasks/practice/12", sourceId: 3012, status: "todo", sourceLabel: "泗水大区", cycleLabel: "本周", progressCurrent: 0, progressTarget: 2, contentScope: "本周 2 次，覆盖 2 个必练单元", practiceTask: { personaIds: [11], scenarioIds: [11], sentenceIds: [11, 12], coverageTarget: 2 } },
      { id: 13, title: "Surabaya Store Exam", type: "exam", dueText: "Due tomorrow", route: "/exam/intro/11", sourceId: 11, status: "todo", sourceLabel: "总部", cycleLabel: "一次性", progressCurrent: 0, progressTarget: 1, contentScope: "区域门店考核" }
    ],
    courses: [
      {
        id: 11,
        title: "Barrier Repair for Humid Weather",
        description: "Surabaya regional playbook for sun exposure, humidity, and sensitive repair needs.",
        progress: 40,
        duration: "16 min",
        tag: "Required",
        source: "regional",
        sourceLabel: "泗水大区",
        createdAt: "2024-06-19",
        coverLabel: "屏障修护专题",
        coverGradient: "from-emerald-200 via-teal-100 to-white"
      },
      {
        id: 12,
        title: "Store Demo: Lightweight Layering",
        description: "How to demonstrate non-sticky textures during busy mall shifts.",
        progress: 0,
        duration: "10 min",
        tag: "New",
        source: "national",
        sourceLabel: "全国",
        createdAt: "2024-06-22",
        coverLabel: "轻薄叠涂演示",
        coverGradient: "from-amber-200 via-orange-100 to-white"
      }
    ],
    personas: [
      {
        id: 11,
        name: "晒后修护咨询 (Mbak Ayu, 31岁)",
        customerName: "Mbak Ayu",
        age: 31,
        sceneLabel: "晒后修护场景",
        tags: ["31岁", "晒后泛红", "湿热通勤", "怕厚重"],
        focus: "晒后泛红、屏障修护、清爽肤感",
        maxScore: 84,
        practiceCount: 4,
        avatarSeed: "Ayu",
        portraitImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
        description: "顾客经常户外通勤，担心晒后泛红和闷痘，希望产品清爽不厚重。",
        color: "indigo",
        firstMessage: "Saya sering panas-panasan naik motor. Kulit jadi merah tapi saya takut pakai produk yang berat.",
        followUpMessage: "Kalau dipakai siang hari, apakah akan lengket di cuaca Surabaya?",
        hint: "先回应当地湿热场景，再强调轻薄质地和神经酰胺屏障修护。",
        sampleReply: "Mbak Ayu, untuk cuaca Surabaya kita pilih tekstur ringan..."
      },
      {
        id: 12,
        name: "控油补水咨询 (Ibu Lestari, 40岁)",
        customerName: "Ibu Lestari",
        age: 40,
        sceneLabel: "控油补水场景",
        tags: ["40岁", "混合肌", "妆前护理", "水油失衡"],
        focus: "水油平衡、妆前护理、套组推荐",
        maxScore: 88,
        practiceCount: 1,
        avatarSeed: "Lestari",
        portraitImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
        description: "顾客白天出油但脸颊干，想找妆前也能用的保湿产品。",
        color: "rose",
        firstMessage: "T-zone saya cepat berminyak, tapi pipi terasa kering. Produk apa yang cocok sebelum makeup?",
        followUpMessage: "Kalau pakai moisturizer lagi, makeup saya akan geser nggak?",
        hint: "说明分区护理和轻薄保湿，再推荐妆前使用方法。",
        sampleReply: "Ibu Lestari, kulit kombinasi perlu hidrasi ringan sebelum makeup..."
      }
    ],
    scenarios: [
      {
        id: 11,
        title: "泗水湿热天气「清爽修护推荐法」",
        maxScore: 80,
        practiceCount: 2,
        firstMessage: "我在泗水天气热的时候不喜欢厚重护肤，容易闷。",
        followUpMessage: "如果我白天也用，会不会影响妆容？",
        hintKeywords: "湿热天气 / 轻薄质地 / 屏障修护"
      }
    ],
    exams: [
      {
        id: 11,
        title: "泗水大区屏障修护知识考核",
        status: "pending",
        questions: 15,
        time: "20分钟",
        date: "截止: 2024-07-05",
        topic: "Barrier Repair",
        question: "泗水湿热天气下，推荐屏障修护产品时应优先强调哪一点？",
        options: ["厚重封闭感", "清爽质地和修护屏障", "强力磨砂", "只强调香味"],
        answerIndex: 1
      },
      {
        id: 12,
        title: "轻薄保湿套组搭配考核",
        status: "completed",
        score: 89,
        questions: 12,
        time: "12分钟",
        date: "2024-05-21",
        topic: "Layering",
        question: "妆前保湿推荐应避免什么？",
        options: ["轻薄乳液", "少量多次", "厚涂油膏", "等待吸收"],
        answerIndex: 2
      }
    ],
    sentences: [
      {
        id: 11,
        category: "护肤品类",
        line: "Barrier Repair for Humid Weather",
        productName: "泗水屏障修护轻盈乳",
        productDescription: "适合湿热天气的轻薄修护质地，兼顾晒后舒缓与屏障修护。",
        productImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
        quote: "这款是轻盈凝露质地，放在泗水这种天气里用会比较舒服，不会闷。",
        hint: "强调轻薄质地 / 湿热天气 / 屏障修护",
        scope: "泗水大区",
        tagline: "湿热天气、晒后修护、清爽不黏腻",
        title: "泗水屏障修护轻盈乳",
        en: "This moisturizer has a <span class='text-rose-500 underline decoration-rose-200'>light gel texture</span> for humid weather.",
        zh: "这款保湿产品是轻盈凝露质地，适合湿热天气。",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 12,
        category: "护肤品类",
        line: "Barrier Repair for Humid Weather",
        productName: "神经酰胺屏障修护霜",
        productDescription: "加强晒后修护，适合想要更强修护感的顾客。",
        productImage: "https://images.unsplash.com/photo-1571781564993-9426f4fcae12?auto=format&fit=crop&w=800&q=80",
        quote: "神经酰胺有助于修护晒后受损的肌肤屏障。",
        hint: "强调晒后修护 / 肌肤屏障 / 稳定肤况",
        scope: "全国",
        tagline: "晒后修护、屏障强化、稳肤",
        title: "神经酰胺屏障修护霜",
        en: "Ceramides help <span class='text-rose-500 underline decoration-rose-200'>repair the skin barrier</span> after sun exposure.",
        zh: "神经酰胺有助于修护晒后受损的肌肤屏障。",
        img: "https://images.unsplash.com/photo-1571781564993-9426f4fcae12?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 13,
        category: "护肤品类",
        line: "Radiance 极光透亮系列",
        productName: "极光焕白精华液",
        productDescription: "适合泗水门店也会推荐的温和提亮型产品。",
        productImage: "https://images.unsplash.com/photo-1601049368168-1e2c4a7d8b65?auto=format&fit=crop&w=800&q=80",
        quote: "它更适合想慢慢提亮、又担心刺激的人群，日常用会比较稳。",
        hint: "温和提亮 / 稳定使用 / 不刺激",
        scope: "泗水大区",
        tagline: "温和提亮、稳定使用、不刺激",
        title: "极光焕白精华液",
        en: "This product supports a <span class='text-rose-500 underline decoration-rose-200'>gentle brightening</span> routine.",
        zh: "这款产品适合温和提亮的日常使用。",
        img: "https://images.unsplash.com/photo-1601049368168-1e2c4a7d8b65?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 14,
        category: "彩妆品类",
        line: "Flawless 丝绒底妆系列",
        productName: "丝绒持妆粉底液",
        productDescription: "适合湿热天气下仍要维持完整底妆的顾客。",
        productImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        quote: "这支粉底适合想要哑光丝绒感，又希望通勤一整天不容易脱妆的顾客。",
        hint: "哑光妆效 / 持妆 / 通勤场景",
        scope: "全国",
        tagline: "持妆底妆、哑光丝绒、通勤不脱妆",
        title: "丝绒持妆粉底液",
        en: "This foundation delivers a <span class='text-rose-500 underline decoration-rose-200'>velvet matte finish</span> for long wear.",
        zh: "这款粉底液适合长时间持妆，呈现丝绒哑光妆感。",
        img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      }
    ],
    stats: {
      studyHours: 86.5,
      roleplayTimes: 27,
      weeklyRank: 6,
      taskCompletionRate: 85,
      latestExamScore: 89,
      totalCoursesStudied: 28,
      totalPracticeTime: "6小时15分",
      monthlyPracticeCount: 27,
      regionRankTotal: 96
    },
    leaderboard: [
      { rank: 1, name: "Dewi", region: "Surabaya Tunjungan", score: 2680 },
      { rank: 2, name: "Maya", region: "Surabaya West", score: 2525 },
      { rank: 6, name: "Mbak Rani", region: "Surabaya Tunjungan", score: 2180, isMe: true }
    ]
  }
};

export function getRegionDataset(regionId: RegionId) {
  return regionData[regionId];
}

export function getCourseUnitId(courseId: number): MissionUnitId {
  return `course:${courseId}`;
}

export function getPracticeUnitId(kind: Exclude<MissionUnitKind, "course">, id: number): MissionUnitId {
  return `${kind}:${id}`;
}

export function getMissionUnitIds(mission: Mission): MissionUnitId[] {
  if (mission.studyTask) {
    return mission.studyTask.courseIds.map(getCourseUnitId);
  }

  if (mission.practiceTask) {
    return [
      ...mission.practiceTask.personaIds.map(id => getPracticeUnitId("persona", id)),
      ...mission.practiceTask.scenarioIds.map(id => getPracticeUnitId("scenario", id)),
      ...mission.practiceTask.sentenceIds.map(id => getPracticeUnitId("sentence", id))
    ];
  }

  return [];
}

export function getMissionCoverageTarget(mission: Mission) {
  if (mission.studyTask) {
    return mission.studyTask.courseIds.length;
  }

  if (mission.practiceTask) {
    return getMissionUnitIds(mission).length;
  }

  return 0;
}

export function missionIncludesUnit(mission: Mission, unitId: MissionUnitId) {
  return getMissionUnitIds(mission).includes(unitId);
}
