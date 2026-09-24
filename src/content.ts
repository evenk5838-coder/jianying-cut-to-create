export const media = (name: string) =>
  name.endsWith(".mp4") && import.meta.env.VITE_VIDEO_BASE_URL
    ? `${import.meta.env.VITE_VIDEO_BASE_URL.replace(/\/$/, "")}/${name}`
    : `${import.meta.env.BASE_URL}media/${name}`;
export const official = "https://www.capcut.cn/";
export const scenes = [
  {
    id: "earth",
    label: "从看见，到表达",
    title: ["世界很大，", "装得下你的想象。"],
    description: "用剪映，把拍下的瞬间，剪成想分享的作品。",
    file: "earth",
    position: "50% 50%",
  },
  {
    id: "nature",
    label: "旅行 · 让风景有情绪",
    title: ["把一阵风，", "留在画面里。"],
    description: "剪映专业版支持关键帧、蒙版与调色，细调运动、局部和色彩。",
    file: "nature",
    position: "50% 50%",
  },
  {
    id: "fashion",
    label: "风格 · 让人物成为焦点",
    title: ["风格，", "由你定义。"],
    description: "智能抠像可识别人像并抠除背景，让画面重新构图。",
    file: "fashion",
    position: "50% 38%",
  },
  {
    id: "speech",
    label: "口播 · 让表达更清楚",
    title: ["留下，", "真正想说的话。"],
    description: "智能剪口播可识别无效词，支持对着文本剪口播。",
    file: "speech",
    position: "52% 35%",
  },
  {
    id: "city",
    label: "城市 · 把碎片连成故事",
    title: ["一座城，", "不止一种节奏。"],
    description: "智能搜索素材帮助定位片段，多时间线便于分区剪辑。",
    file: "city",
    position: "50% 50%",
  },
  {
    id: "future",
    label: "想象 · 让灵感越过现实",
    title: ["还没见过，", "也可以先想象。"],
    description: "剪映官网提供「视频生成」创作入口，拓展影像构想。",
    file: "future",
    position: "50% 50%",
  },
  {
    id: "finale",
    label: "你的视角，就是开始",
    title: ["下一部作品，", "交给你。"],
    description: "记录生活、表达观点，或试着拍一支自己的风格短片。",
    file: "finale",
    position: "50% 50%",
  },
];
export type FeatureId = "nature" | "fashion" | "speech" | "city" | "future";
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
  nature: {
    title: "关键帧、蒙版与调色",
    subtitle: "让风景拥有自己的节奏。",
    description:
      "从画面怎样移动，到局部如何呈现，再到色彩的细节，剪映专业版提供逐步调整的空间。",
    capabilities: [
      "关键帧：设置起点与终点，组织移动、缩放和淡入淡出。",
      "蒙版：使用不同形状划定画面区域，进行局部处理。",
      "调色：通过色轮、HSL 和曲线调整色彩。",
    ],
    scenarios: "旅行 Vlog、风光短片，以及需要统一色彩与节奏的生活记录。",
    imageAlt: "雾气与阳光穿过森林",
    visualTitle: "风景中的光与层次",
  },
  fashion: {
    title: "智能抠像",
    subtitle: "让人物成为画面的重点。",
    description:
      "剪映的智能抠像可识别人像并去除背景，为人物画面的重新组合提供基础。",
    capabilities: [
      "识别人像主体，将人物与原背景分开。",
      "结合剪辑与画面编排，安排主体和背景的关系。",
    ],
    scenarios: "人物介绍、穿搭内容，以及需要重新安排人物背景的短片。",
    imageAlt: "身穿黑色服装的时尚人物",
    visualTitle: "人物与风格",
  },
  speech: {
    title: "智能剪口播",
    subtitle: "把时间留给真正想说的话。",
    description:
      "剪映支持识别口播中的无效词，并通过文本进行口播剪辑，帮助整理表达。",
    capabilities: [
      "识别无效词，辅助检查需要精简的部分。",
      "对照文本剪辑口播，让内容整理有清楚的线索。",
    ],
    scenarios: "知识分享、产品讲解、访谈整理和自媒体口播。",
    imageAlt: "面向镜头讲话的人物",
    visualTitle: "一次面对镜头的表达",
  },
  city: {
    title: "智能搜索素材与多时间线",
    subtitle: "把城市的片段，组织成故事。",
    description: "剪映提供素材定位与分区剪辑的能力，方便在镜头较多时整理内容。",
    capabilities: [
      "智能搜索素材：识别并定位需要的片段。",
      "多时间线：在同一个草稿中创建多条时间线，分区整理剪辑。",
    ],
    scenarios: "城市漫游、旅行合集，以及需要按主题整理大量镜头的项目。",
    imageAlt: "城市夜晚的路口与建筑",
    visualTitle: "一座城的不同节奏",
  },
  future: {
    title: "视频生成",
    subtitle: "为想象打开另一种创作入口。",
    description:
      "剪映官网将「视频生成」列为 AI 创作能力，提供探索影像构想的入口。",
    capabilities: [
      "从剪映官网进入电脑端产品，了解视频生成的创作方式。",
      "围绕主题探索画面方向，再结合剪辑组织表达。",
    ],
    scenarios: "概念短片、视觉提案，以及未来场景的创意探索。",
    imageAlt: "未来城市的灯光与道路",
    visualTitle: "灵感方向 · 未来城市",
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
