# 改版验证报告

> 此为前一轮全屏影像改版的历史记录。最新功能详情、自动播放策略和公开发布结果见 [PUBLIC_RELEASE_QA.md](PUBLIC_RELEASE_QA.md)。

2026-09-24。此次在原项目中改版；旧穿梭空间、模拟时间线与编辑器、网格、编号导航及 Three.js / R3F 依赖已删除。以下报告覆盖新的全屏作品叙事，原始结果与截图在 [qa/revision/](qa/revision/)。

## 测试条件

- MacBook Pro，Apple M1 Pro（8 核）、16 GB 内存，macOS arm64；Node.js 24.18。
- Google Chrome 153.0.8010.53 / Playwright headless；生产预览 `http://127.0.0.1:4173/`。
- 桌面 1440×900；手机 390×844。性能测试 DPR 2，手机加触屏与 4 倍 CPU 限速；功能截图 DPR 1。另查 360×640 + 系统减少动态效果。
- Codex 内置浏览器另作首屏、滚动、标志和画面构图检查。桌面及手机逐幕截图、六个转场中间态均已查看。
- 手机为浏览器模拟，**未测试 iPhone / Android 真机或 Safari / Firefox**；CPU 限速不等于真实手机 GPU。没有宣称所有设备达到相同表现。

## 功能与构建

`npm run build` 成功，TypeScript 与 Vite 生产构建通过。最后一轮 `npm run test:e2e` **6 / 6 通过（19.7 秒）**：

| 检查 | 结果 |
| --- | --- |
| 桌面首屏与全流程 | 舞台恰好 1440×900，7 幕可达，无 canvas、无横向溢出；初始只请求地球影片 |
| 手机首屏与全流程 | 390×844 铺满视口，使用独立竖版编码，文字、按钮与面孔可辨识 |
| 正反转场 | 相同滚动位置的遮罩 / 位移 / 可见状态一致；6 个交接区主文案均先退场；任意检查点最多 1 组主文案 |
| 字幕与页脚 | 口播常驻字幕和离场末句互斥，修复双字幕；页脚为正常流 relative 区块，在影像容器结束后出现 |
| 原声与配乐 | 口播视频含同期 AAC，点击后 muted=false、paused=false、currentTime 前进；配乐从 0.12 降至 0.0144，离场恢复；关闭后实际 paused |
| 成片及来源 | 18 秒短片可主动播放；来源弹窗可打开、Escape 关闭并恢复焦点 |
| 减少动态 / 媒体失败 | 默认静帧，可继续访问每幕；模拟视频请求失败仍保留静帧与文案 |
| 声音失败 / 取消 | 模拟浏览器拒绝播放，不会显示已播放；缓冲时取消，响应后来到达仍不出声 |

桌面 / 手机正常流程没有未捕获 JavaScript 错误。转场中允许两个片段短暂交接，交接后仅当前画面可见。测试记录媒体源 ≤2、同时播放 ≤2；离屏暂停，远处解除 src。不是所有影片预加载在后台。

## 实测性能与优化取舍

[优化前记录](qa/revision/performance-before-optimization.json)显示：在视频解码与连续滚动同时进行时，桌面约 30.6 FPS、手机模拟约 31.1 FPS，未达到目标。对照空白页和静止首屏约 60 FPS，进一步关闭视频播放后滚动恢复约 60 FPS，因此将解码与连续滚动分开。

最终实现：**滚动时保持当前视频帧，停留 140 毫秒后续播；素材只播放一次，不循环**。人物原声在口播幕内可连续播放，跨幕即停止。矩形转场改为外层遮挡位移和内层反向位移，图片位置与大小不变；避免每帧重复写相同样式。手机将字形开口简化为横向遮罩与标题前景。没有增加 WebGL、粒子或后期特效。

生产功能版本单独测量 14 秒连续滚动（7 秒前进 + 7 秒倒退），记录真实 requestAnimationFrame 间隔，而非按预设动画时长推算。它反映滚动动画调度，**不是把 24/30 fps 视频称为 60 fps 视频**。

| 条件 | 平均 rAF FPS | P95 帧间隔 | >33.4 ms 帧数 | 最大已挂载视频源 | 最大同时播放 | 最大主文案组 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 桌面 1440×900 / DPR 2 | 59.87 | 16.7 ms | 0 | 2 | 1 | 1 |
| 手机 390×844 / DPR 2 / CPU 4× | 59.94 | 16.7 ms | 0 | 2 | 1 | 1 |

见 [performance.json](qa/revision/performance.json)。手机初始化仍记录 66 ms 和 123 ms 的长任务；这次连续滚动采样没有 >33.4 ms 帧，不保证所有操作和网络条件下都无掉帧。该性能优化意味着滚动期间背景影像短暂定格，停留后继续动态画面。

### 首屏冷启动

Chrome CDP：冷缓存、下载 4 Mbps、上传 1 Mbps、150 ms 延迟。网络测试未叠加 CPU 限速，不能与上表混为同一种条件。

| 条件 | FCP / LCP | 首段视频可显示帧 | 初始视频源 |
| --- | ---: | ---: | ---: |
| 桌面 | 0.66 s / 0.66 s | 1.34 s | 1 |
| 手机 | 0.65 s / 0.65 s | 1.14 s | 1 |

[load.json](qa/revision/load.json)。视频达到 loadeddata 不等于整段已下载。首次进入没有请求配乐；视频支持 faststart。网络为本机 CDP 模拟，不是远程 CDN 或蜂窝网络实测。

最终构建：主 JS 约 291.44 KB（gzip 97.78 KB），GSAP 分块 70.04 KB（gzip 27.53 KB），CSS 13.39 KB（gzip 3.96 KB）。首屏海报 79.8 KB；地球桌面片段 3.36 MB / 手机 1.38 MB。所有媒体合计约 70 MB，但不在首屏一并请求。没有 Three/R3F 大包或字体网络请求。

## 素材与画面核验

8 个原始来源逐一记录实际尺寸、声音、下载地址和许可；14 个网站派生视频通过 FFmpeg 全量解码，保留哈希。口播原声存在且本地转写可识别完整句子，音画来自同一 MP4，不使用异源配音。核查范围没有包括真人耳听或逐帧唇形测量。详见 [素材授权清单](MEDIA_LICENSES.md)。

- [桌面首屏](qa/revision/desktop-earth.png)、[自然](qa/revision/desktop-nature.png)、[时尚](qa/revision/desktop-fashion.png)、[口播](qa/revision/desktop-speech.png)、[城市](qa/revision/desktop-city.png)、[未来](qa/revision/desktop-future.png)、[成片](qa/revision/desktop-finale.png)、[页脚](qa/revision/desktop-footer.png)
- [手机首屏](qa/revision/mobile-earth.png)、[口播](qa/revision/mobile-speech.png)、[成片](qa/revision/mobile-finale.png)、[页脚](qa/revision/mobile-footer.png)
- [字形转场](qa/revision/transition-fashion-speech.jpg)、[字幕转场](qa/revision/transition-speech-city.jpg)、[城市横向遮罩](qa/revision/transition-city-future.jpg)

## 保留的边界

- 城市与未来素材无法严密匹配建筑构图，因此使用干净的横向遮罩，没有伪造匹配剪接或增加故障效果。
- 口播为英文原声配本站整理的中文译文；没有在剪映中真实执行智能剪口播、抠像或视频生成。未来素材与最终短片都有概念演示标注。
- 手机竖版为同一素材的中心裁切；人物口播取近景，横版两侧内容会被裁去。视频保持源文件可用清晰度，口播未虚报 4K 或 1080p 宽屏原片。
- 用户音乐只用于授权网站部署，不进入公开源码、Git 历史或源码 zip。源码包没有配乐时可静音探索或从本机选曲。
- 本地构建与以上检查已完成；远程部署状态单独记录于交付说明，不由本地测试推断。
