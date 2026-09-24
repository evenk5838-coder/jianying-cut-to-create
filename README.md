# 剪映 · 让灵感成为作品

2026-09-25 用户确认版本：首屏地球 → 专业剪辑 → 智能剪口播 → 人像美化与智能抠像（P5）→ 调色与画质增强 → AI 视频生成 → 人物、海岸、城市、建筑结尾混剪。独立制作，非官方作品。

本次发布记录、文件校验和回退信息见 [release](docs/release/ROLLBACK.md)。下方早期 QA 记录仅代表当时版本，正式发布以本次验收为准。

## 运行与构建

Node.js 22.12+（本地验证 24.18）。

```bash
npm ci
npm run dev
# 默认 http://127.0.0.1:5173；端口被占用时：npm run dev -- --port 5174
npm run build
npm run preview -- --port 4173
```

`dist/` 是可部署的静态网站。首屏只挂载地球媒体源；其他片段在接近时加载。桌面影片以 1080p 为主；轻量版是专门裁切的 720×1280。当前及转场中的下一片段最多两个视频同时播放，离屏暂停。滚动不控制视频播放进度，功能章节与结尾循环播放；原声口播在同一视频上开启，不重启画面。手机默认轻量版，可在页脚切换。

## 声音

进入时尝试低音量播放；浏览器拦截时，右下角提供一次点击开启入口。主动关闭后记住偏好，后续进入保持关闭。静音探索会停止配乐。口播有独立的「听人物原声」按钮，同一 MP4 内音画同步；原声播放时降低配乐，离开口播幕后停止。

用户歌曲 **不进入源码**。自行准备有权使用的音频：

- 本地 / 部署时放入 `public/media/private-soundtrack.mp3`（已被 .gitignore 排除）；或
- `.env.local` 设置 `VITE_AUDIO_URL=https://your-authorized-host.example/music.mp3`；或
- 访客从音乐设置里选择本机文件，仅在浏览器播放。

公开仓库缺少歌曲时不会声称已播放，提供本机选曲入口。网站配乐不是剪映 AI 音乐演示。网站部署构建可含用户已授权歌曲，但不得上传到公开源码或公开 Release 素材包。

## 交互结构

- `src/lib/sequence.ts`：绝对滚动进度、旧文案退场与新文案入场的时序。
- `src/components/FilmStage.tsx`：单个 sticky 全屏舞台、可逆遮罩、媒体解码预算、原声控制。
- `src/components/Sound.tsx`：真实播放状态、加载取消、音量与换曲。
- `src/content.ts`：文案、五个独立功能详情与素材入口。
- 每个功能详情只展示对应能力、使用场景与同幕视觉素材；关闭后返回原滚动位置，详情期间暂停背景视频。
- `src/styles.css`：全屏构图、独立移动布局、正常流页脚。

减少动态模式使用静帧和直接切换；用户仍可主动播放。原始视频本身的摄影运动保留，网页没有持续推进/后退或缩放。成片为本站原创编排，未用剪映导出。

## 验证

启动生产预览后：

```bash
npm run test:e2e
node scripts/measure-performance.mjs
node scripts/measure-load.mjs
```

测试使用已安装的 Google Chrome。测量脚本要单独运行，避免视频编码或其他重负载干扰。结果、实际条件和限制见 [本次发布验收](docs/PUBLIC_RELEASE_QA.md) 和 [影像改版 QA 报告](docs/QA_REPORT.md)。手机尺寸与 CPU 限速属于模拟，不能代替真机 Safari / Android 性能。

## 资料与授权

- [产品事实来源](docs/FACT_SOURCES.md)
- [素材授权清单](docs/MEDIA_LICENSES.md)
- [镜头脚本](docs/STORYBOARD.md)
- [设计参考](docs/DESIGN_REFERENCES.md)
- [部署说明](docs/DEPLOYMENT.md)
- [第三方代码许可](THIRD_PARTY_NOTICES.md)

原创代码采用 MIT；剪映商标、Pexels / NASA 影像、用户配乐不适用 MIT。仓库内压缩片段仅为此网站组成部分，并非项目自有开源素材或素材库。不要将素材独立销售、冒充原创或暗示人物背书。二次发布必须保留各自来源与适用条款。

可使用 `scripts/prepare-films.py` 从依法取得的源文件重新编码，需 FFmpeg（libx264、libwebp）和 Python 3。脚本不下载私有音乐，原片下载路径与规格见素材清单。
