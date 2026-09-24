export const media = (name: string) =>
  name.endsWith(".mp4") && import.meta.env.VITE_VIDEO_BASE_URL
    ? `${import.meta.env.VITE_VIDEO_BASE_URL.replace(/\/$/, "")}/${name}`
    : `${import.meta.env.BASE_URL}media/${name}`;
export const official = "https://www.capcut.cn/";
export type FeatureId = "city" | "speech" | "fashion" | "nature" | "future";
export const scenes = [
  {
    id: "earth",
    label: "从看见，到表达",
    title: ["世界很大，", "装得下你的想象。"],
    description: "用剪映，把拍下的瞬间，剪成想分享的作品。",
    benefit: "",
    file: "earth",
    position: "50% 50%",
  },
  {
    id: "city",
    label: "从片段，到完整故事",
    title: ["专业剪辑"],
    description: "用多时间线组织镜头，以关键帧和蒙版安排画面变化。",
    benefit: "理清素材、控制节奏，让零散片段形成完整表达。",
    file: "city",
    position: "50% 50%",
  },
  {
    id: "speech",
    label: "让表达更清楚",
    title: ["智能剪口播"],
    description:
      "识别无效词，对照文本剪辑；结合人声分离、音频降噪与人声美化整理声音。",
    benefit: "少花时间反复听找，把精力留给真正想说的话。",
    file: "speech",
    position: "52% 35%",
  },
  {
    id: "fashion",
    label: "把焦点留给人物",
    title: ["人像美化", "与智能抠像"],
    description:
      "调整人像呈现，识别人像并抠除背景，为人物画面的重新组合提供基础。",
    benefit: "让人物与场景更协调，也给背景设计留下空间。",
    file: "fashion",
    position: "50% 38%",
  },
  {
    id: "nature",
    label: "把细节与情绪带回来",
    title: ["调色与画质增强"],
    description:
      "用色轮、HSL 与曲线调整色彩；「超清画质」提供画质修复和增强能力。",
    benefit: "统一镜头的色彩表达，改善素材的观看质感。",
    file: "nature",
    position: "50% 50%",
  },
  {
    id: "future",
    label: "为想象寻找画面",
    title: ["AI 视频生成"],
    description: "剪映提供「视频生成」创作入口，让创意有机会成为动态画面。",
    benefit: "探索新的视觉方向，再通过剪辑组织成自己的作品。",
    file: "future",
    position: "50% 50%",
  },
  {
    id: "finale",
    label: "你的视角，就是开始",
    title: ["下一部作品，", "交给你。"],
    description: "记录生活、表达观点，或试着拍一支自己的风格短片。",
    benefit: "",
    file: "finale",
    position: "50% 50%",
  },
];
export const speechIndex = scenes.findIndex((s) => s.id === "speech");
export const featureDetails: Record<
  FeatureId,
  {
    title: string;
    subtitle: string;
    description: string;
    capabilities: string[];
    scenarios: string;
    imageAlt: string;
    visualTitle: string;
  }
> = {
  city: {
    title: "专业剪辑",
    subtitle: "把镜头组织成有节奏的故事。",
    description:
      "从整理素材到安排画面衔接，剪映专业版提供多时间线、关键帧和蒙版等剪辑工具。",
    capabilities: [
      "多时间线：在同一个草稿中分区组织镜头。",
      "关键帧：设置画面变化的起点和终点。",
      "蒙版：划定呈现区域，辅助完成局部处理与转场。",
    ],
    scenarios: "旅行短片、城市记录、多镜头项目和需要清楚叙事的内容。",
    imageAlt: "既有城市夜景中的路口与建筑",
    visualTitle: "不同镜头，共同构成一座城",
  },
  speech: {
    title: "智能剪口播",
    subtitle: "整理内容，也照顾声音。",
    description:
      "通过无效词识别与文本剪辑，辅助整理口播内容。口播相关的声音处理放在同一创作过程中。",
    capabilities: [
      "智能剪口播：识别无效词，对照文本进行剪辑。",
      "人声分离：提取人声或背景声，便于分开处理。",
      "音频降噪：过滤环境噪声；人声美化：调整人声听感。",
    ],
    scenarios: "知识分享、产品讲解、采访整理与面对镜头的日常表达。",
    imageAlt: "正在面对镜头讲话的人物",
    visualTitle: "表达的重点，是你想说的话",
  },
  fashion: {
    title: "人像美化与智能抠像",
    subtitle: "让人物与画面各得其所。",
    description:
      "美颜美体用于人像呈现调整，智能抠像识别人像并去掉原背景，两类能力服务于不同的处理需求。",
    capabilities: [
      "美颜美体：支持单人和多人模式的人像处理。",
      "智能抠像：识别人像主体并抠除背景。",
      "结合剪辑重新安排人物、背景与画面构图。",
    ],
    scenarios: "人物介绍、穿搭内容、商业人像和需要更换人物背景的创意短片。",
    imageAlt: "窗边柔光下的长发人物近景，P5 已确认素材",
    visualTitle: "光影、人物与画面关系",
  },
  nature: {
    title: "调色与画质增强",
    subtitle: "色彩塑造情绪，清晰度照顾细节。",
    description:
      "调色用于调整画面色彩；超清画质用于修复与增强画质。两者有不同用途，实际改善程度取决于原始素材。",
    capabilities: [
      "调色：通过色轮、HSL 和曲线调整色彩。",
      "智能调色：提供画面色彩的自动调整能力。",
      "超清画质：提供画质修复和增强入口。",
    ],
    scenarios:
      "风景记录、不同相机素材的色彩统一，以及需要改善观看质感的旧素材。",
    imageAlt: "同一段保留的雾林风景",
    visualTitle: "同一片森林，不同色彩表达",
  },
  future: {
    title: "AI 视频生成",
    subtitle: "从创意构想，走向画面探索。",
    description:
      "剪映官网列出视频生成能力。可从官方产品入口了解具体创作方式，再结合剪辑完善表达。",
    capabilities: [
      "视频生成：探索动态影像的创作方向。",
      "结合专业剪辑整理片段、安排节奏并完成作品。",
      "具体输入形式、可用额度与功能范围以当前客户端为准。",
    ],
    scenarios: "概念短片、视觉提案和需要探索未来场景的创意项目。",
    imageAlt: "未来城市的创意画面",
    visualTitle: "未来题材的视觉构想",
  },
};
export const credits = [
  ["NASA Johnson", "地球影像", "https://svs.gsfc.nasa.gov/30771/"],
  [
    "Zetong Li",
    "雾林",
    "https://www.pexels.com/video/aerial-view-of-the-fog-and-trees-in-the-forest-27585640/",
  ],
  [
    "cottonbro studio",
    "时尚人物",
    "https://www.pexels.com/video/a-model-woman-posing-in-black-dress-9510011/",
  ],
  [
    "mona lou",
    "同期口播",
    "https://www.pexels.com/video/a-woman-talking-in-front-of-camera-4156500/",
  ],
  [
    "Evgenij Mikhailov",
    "城市建筑",
    "https://www.pexels.com/video/vibrant-night-cityscape-with-neon-lights-30417700/",
  ],
  [
    "Sam Lastres",
    "雨夜街道",
    "https://www.pexels.com/video/walking-in-a-street-in-asia-3941990/",
  ],
  [
    "Guarionex Del Carmen",
    "城市路口",
    "https://www.pexels.com/video/night-at-the-city-of-tokyo-4851872/",
  ],
  [
    "Adis Resic",
    "未来城市",
    "https://www.pexels.com/video/futuristic-cyberpunk-city-at-night-28615179/",
  ],
];
