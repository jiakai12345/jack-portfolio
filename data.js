window.portfolioData = {
  person: {
    name: "贾凯 / Jack",
    handle: "Portfolio OS",
    role: "TVC 广告摄影师 / 个人 IP 操盘手 / AIGC 内容创作者",
    location: "China / Remote",
    availability: "空窗中 / AIGC 内容创作中 / 建立个人作品库中",
    email: "hello@example.com",
    phone: "+86 000 0000 0000",
    summary:
      "我正在把影像经验、个人 IP 方法和 AIGC 内容实践整理成一个可持续生长的作品库。这里先让你了解我是谁，再进入简历、作品和后续会慢慢补齐的创作档案。",
    tags: ["TVC", "广告摄影", "个人 IP", "AIGC", "内容创作", "作品库"],
  },
  links: [
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "小红书", href: "https://www.xiaohongshu.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  contactCards: {
    email: {
      label: "Email",
      kicker: "copy email",
      title: "hello@example.com",
      body: "点击按钮复制邮箱，后面替换成你的真实地址。",
      action: "复制邮箱",
    },
    xiaohongshu: {
      label: "小红书",
      kicker: "scan rednote",
      title: "小红书",
      body: "这里之后换成你的小红书二维码图片。",
      qr: "QR",
    },
    douyin: {
      label: "抖音",
      kicker: "scan douyin",
      title: "抖音",
      body: "这里之后换成你的抖音二维码图片。",
      qr: "QR",
    },
  },
  stats: [
    { value: "TVC", label: "广告摄影经验" },
    { value: "IP", label: "个人品牌操盘" },
    { value: "AIGC", label: "内容创作进行中" },
  ],
  experience: [
    {
      period: "2025 - Now",
      title: "独立创作者 / 设计开发者",
      company: "Personal Studio",
      body:
        "为个人品牌、小型产品和内容项目搭建从定位、视觉系统、页面实现到自动化工作流的一体化方案。",
    },
    {
      period: "2023 - 2025",
      title: "产品设计师",
      company: "示例公司",
      body:
        "负责复杂业务后台、移动端流程和增长落地页设计，参与用户研究、信息架构、组件规范与交付走查。",
    },
    {
      period: "2021 - 2023",
      title: "视觉与前端实践",
      company: "Freelance",
      body:
        "完成品牌视觉、互动网页、内容模板和轻量工具开发，把设计语言沉淀为可复用组件。",
    },
  ],
  skills: [
    {
      group: "Design",
      items: ["用户旅程", "信息架构", "界面系统", "原型验证", "视觉叙事"],
    },
    {
      group: "Build",
      items: ["HTML/CSS/JS", "React", "响应式页面", "可访问性", "部署上线"],
    },
    {
      group: "AI",
      items: ["Prompt Workflow", "图文生产", "自动化工具", "知识库整理"],
    },
  ],
  projects: [
    {
      id: "system",
      title: "个人知识系统",
      category: "AI Workflow",
      year: "2026",
      summary:
        "把散落的笔记、项目和创意整理成可检索、可复用、可输出的个人知识操作台。",
      impact: "信息查找时间减少 60%，内容复用效率明显提升。",
      role: "信息架构、交互设计、前端原型",
      tools: ["Obsidian", "HTML", "Automation"],
      color: "blue",
    },
    {
      id: "brand",
      title: "个人品牌视觉系统",
      category: "Brand",
      year: "2026",
      summary:
        "为个人 IP 制定颜色、字体、卡片版式、封面模板和页面组件，减少内容输出的风格漂移。",
      impact: "形成 12 个可复用模板，适配网站、图文和演示页面。",
      role: "视觉系统、模板设计、规范文档",
      tools: ["Figma", "CSS", "Design System"],
      color: "yellow",
    },
    {
      id: "dashboard",
      title: "作品集工作台",
      category: "Frontend",
      year: "2026",
      summary:
        "一个同时服务招聘方和合作方的作品集站点，支持项目筛选、案例弹窗和简历打印。",
      impact: "让首屏即说明定位，点击 2 次内看到代表项目和联系方式。",
      role: "产品设计、前端实现、内容策略",
      tools: ["JavaScript", "CSS Grid", "Responsive"],
      color: "red",
    },
    {
      id: "campaign",
      title: "活动 Landing Page",
      category: "Web Design",
      year: "2025",
      summary:
        "为线上分享会设计报名页，使用强节奏版式、清晰 CTA 和内容分层提升转化。",
      impact: "页面发布后一周内完成首批种子用户报名。",
      role: "页面策划、视觉设计、前端交付",
      tools: ["HTML", "CSS", "Analytics"],
      color: "blue",
    },
    {
      id: "content",
      title: "图文内容模板库",
      category: "Content",
      year: "2025",
      summary:
        "为长文、教程和小红书图文建立封面与内页模板，兼顾信息密度和视觉锚点。",
      impact: "单篇内容制作时间从半天压缩到 60 分钟内。",
      role: "内容结构、视觉模板、生产流程",
      tools: ["Markdown", "Canva", "AI Image"],
      color: "yellow",
    },
    {
      id: "tool",
      title: "轻量业务工具",
      category: "Tool",
      year: "2024",
      summary:
        "把重复的表格整理、文案生成和素材命名流程做成浏览器里可用的小工具。",
      impact: "团队每周节省约 5 小时重复整理工作。",
      role: "需求拆解、工具设计、脚本实现",
      tools: ["JavaScript", "CSV", "LocalStorage"],
      color: "red",
    },
  ],
};
