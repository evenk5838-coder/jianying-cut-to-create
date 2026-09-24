## 当前结尾（用户确认接入）

结尾采用已展示的「人物 → 海岸 → 城市 → 建筑」约 18 秒混剪，替代重复地球及候选占位。四条原素材及作者、链接、规格、Pexels 许可见 [素材来源](MEDIA_CANDIDATES.md) 和 `public/review-media/catalog.json` 的 human、coast、montage-city、architecture 记录。无素材原声，沿用网站配乐；第三方素材不适用代码 MIT 许可。桌面采用确认过的 1920×1080 混剪，轻量版为同一横屏构图的 1280×720 转码。

# 素材来源与授权清单

> 新版仍保留下列既有素材文件，章节顺序和激活状态已调整；旧 finale 不再挂载。新增但尚未接入主页面的候选、独立混剪及授权见 [MEDIA_CANDIDATES.md](MEDIA_CANDIDATES.md)。下方旧版的播放一次策略、结尾成片说明是基线记录，新版播放行为见 PREVIEW_REVISION.md。

核验日期：2026-09-24。网站为独立、非官方产品概念作品。影像创作者、出镜人物、NASA 及画面中的品牌没有为剪映或本网站背书。

## 授权范围

- [Pexels License](https://www.pexels.com/license/)允许免费用于网站及修改；无需署名，但本站保留作者与原页面。不得暗示人物或品牌支持产品，不得将未改变的文件独立销售、上传为素材平台内容或冒充自有素材。人物影像不用于贬损或敏感叙述。
- [NASA 媒体使用说明](https://www.nasa.gov/nasa-brand-center/images-and-media/)：NASA 自有媒体在美国通常不受版权保护，可用于信息性网页；保留来源，不暗示 NASA 背书。第三方权利、标志和可辨识人物有额外限制。此次地球素材页注明 NASA Johnson，核验时未标注第三方版权持有人，选段没有人物或 NASA 标志；不标记为 CC0。
- 这些是第三方素材的使用依据，**不是本项目拥有的 MIT 开源资产**。源码仓库只附用于本站的压缩、裁切或编排片段，原始下载文件不进入仓库。再使用时须自行遵守各自条款、保留来源；不要将它们打包成通用素材库。
- 全屏影像、字幕、转场和结尾短片不表示剪映实际处理结果；未来城市来自素材作者的数字影像，非剪映生成。

## 当前独立预览：已确认 P5

用户已选择 P5。人像章节及详情海报已替换为 KoolShooters 的 [窗边长发人像](https://www.pexels.com/video/close-up-of-a-pretty-woman-brushing-her-hair-8955481/)，适用 Pexels License。实际源文件 2560×1440、24fps、22.42s、无音轨；只取 0–6.8s。桌面保持 1920×1080 横屏原构图；手机从原片 x=825、y=0 取 810×1440，输出 720×1280，保留脸部及发丝。海报从第 1 秒提取。未添加美颜滤镜或伪造处理前后。原始记录与 SHA256 见 `public/review-portraits/catalog.json`。

以下旧 fashion 记录保留作回退基线；不再代表本独立预览的人像素材。其他章节未变。

## 原始文件逐项核查

下列规格由实际下载文件的 FFprobe 数据得出，不根据文件名推断。精确字节数、SHA-256 与音轨数据见 [source-audit.json](qa/revision/source-audit.json)。所有源文件位于制作临时目录，公开仓库不包含原片。

| 本地源文件名 | 内容 / 作者及来源 | 实际画幅 / 帧率 | 时长 | 原始声音 | 授权 |
| --- | --- | --- | ---: | --- | --- |
| `earth-source.mp4` | 地球 / [NASA Johnson](https://svs.gsfc.nasa.gov/30771/) | 3840×2160 横版 / 23.98 fps | 97.22 s | 无音轨 | NASA 媒体使用说明 |
| `nature-source.mp4` | 雾林 / [Zetong Li](https://www.pexels.com/video/aerial-view-of-the-fog-and-trees-in-the-forest-27585640/) | 3840×2160 横版 / 59.94 fps | 18.55 s | 无音轨 | Pexels License |
| `fashion-source.mp4` | 时尚人物 / [cottonbro studio](https://www.pexels.com/video/a-model-woman-posing-in-black-dress-9510011/) | 2732×1440 横版 / 25.00 fps | 9.08 s | 无音轨 | Pexels License |
| `speech-source.mp4` | 原声口播 / [mona lou](https://www.pexels.com/video/a-woman-talking-in-front-of-camera-4156500/) | 1608×1080 横版 / 30.00 fps | 206.38 s | AAC 2 声道 | Pexels License |
| `tokyo-source.mp4` | 东京路口 / [Guarionex Del Carmen](https://www.pexels.com/video/night-at-the-city-of-tokyo-4851872/) | 2562×1440 横版 / 29.97 fps | 17.62 s | AAC 2 声道 | Pexels License |
| `street-source.mp4` | 雨夜街道 / [Sam Lastres](https://www.pexels.com/video/walking-in-a-street-in-asia-3941990/) | 1920×1080 横版 / 30.00 fps | 10.28 s | AAC 1 声道 | Pexels License |
| `city-source.mp4` | 城市建筑 / [Evgenij Mikhailov](https://www.pexels.com/video/vibrant-night-cityscape-with-neon-lights-30417700/) | 3840×2160 横版 / 29.97 fps | 15.02 s | 无音轨 | Pexels License |
| `future-source.mp4` | 未来城市 / [Adis Resic](https://www.pexels.com/video/futuristic-cyberpunk-city-at-night-28615179/) | 3840×2160 横版 / 25.00 fps | 41.60 s | 无音轨 | Pexels License |

特别说明：时尚素材下载 URL 虽写有 `4096_2160`，实际文件为 **2732×1440**；口播原片为 **1608×1080**，并非 16:9，也不是 1080p 宽屏。本站没有把放大后的尺寸写成原片清晰度。

### 官方下载文件

- `earth-source.mp4`：[直接文件](https://svs.gsfc.nasa.gov/vis/a030000/a030700/a030771/ISS_View_of_Planet_Earth_2160p.mp4)；素材独立页和作者见上表。
- `nature-source.mp4`：[直接文件](https://videos.pexels.com/video-files/27585640/12175382_3840_2160_60fps.mp4)；素材独立页和作者见上表。
- `fashion-source.mp4`：[直接文件](https://videos.pexels.com/video-files/9510011/9510011-uhd_4096_2160_25fps.mp4)；素材独立页和作者见上表。
- `speech-source.mp4`：[直接文件](https://videos.pexels.com/video-files/4156500/4156500-hd_1608_1080_30fps.mp4)；素材独立页和作者见上表。
- `tokyo-source.mp4`：[直接文件](https://videos.pexels.com/video-files/4851872/4851872-uhd_2562_1440_30fps.mp4)；素材独立页和作者见上表。
- `street-source.mp4`：[直接文件](https://videos.pexels.com/video-files/3941990/3941990-hd_1920_1080_30fps.mp4)；素材独立页和作者见上表。
- `city-source.mp4`：[直接文件](https://videos.pexels.com/video-files/30417700/13034903_3840_2160_30fps.mp4)；素材独立页和作者见上表。
- `future-source.mp4`：[直接文件](https://videos.pexels.com/video-files/28615179/12433512_3840_2160_25fps.mp4)；素材独立页和作者见上表。

## 网站派生文件与处理

全部为 H.264 / yuv420p / faststart。桌面通常为 1920×1080、24 fps；口播保持 1608×904、30 fps，避免无谓放大。手机为独立中心裁切的 720×1280、24 fps。页面以 object-fit: cover 填满，没有网页驱动的视频放大或持续前进镜头。窄屏会裁去横幅两侧，不改变素材人物身份。

| 文件前缀 | 选段和处理 | 桌面 / 手机大小 | 成片时长 |
| --- | --- | --- | --- |
| `earth.mp4` / `earth-mobile.mp4` | 原片 8–19 s；裁去边缘，旋转 180°，缩放 | 3.36 / 1.38 MB | 11.00 s |
| `nature.mp4` / `nature-mobile.mp4` | 原片 0–10 s；缩放裁切，无处理前后演示 | 3.59 / 1.28 MB | 10.00 s |
| `fashion.mp4` / `fashion-mobile.mp4` | 原片 0–9 s；缩放裁切，没有抠像或换人 | 2.47 / 1.64 MB | 9.00 s |
| `speech.mp4` / `speech-mobile.mp4` | 原片 0–15.35 s；裁为 1608×904；原 AAC 与同期画面一起编码 | 8.00 / 5.52 MB | 15.37 s |
| `city.mp4` / `city-mobile.mp4` | tokyo、street、city 各取 1–6 s，按顺序串联，移除环境音轨 | 8.26 / 4.40 MB | 15.00 s |
| `future.mp4` / `future-mobile.mp4` | 原片 0–10 s；缩放裁切，保留作者数字影像 | 5.62 / 2.27 MB | 10.00 s |
| `finale.mp4` / `finale-mobile.mp4` | 上述六幕各取前 3 s 串联，末秒淡出；本站 FFmpeg 编排 | 7.80 / 3.65 MB | 18.00 s |

每幕的 `*-poster.webp` 从其视频 0.1 s 抽帧，宽 1600 px，作为加载中 / 失败 / 减少动态模式的静帧。14 段派生 MP4 已逐一完整解码无错误，文件哈希及音轨见 [media-audit.json](qa/revision/media-audit.json)；海报及派生文件大小和哈希见 [media-files.json](qa/media-files.json)。

### 口播真实性与字幕

口播为 mona lou 面向镜头说话的真实源片，保留同一个 MP4 中的 AAC 原声。不是用配音对口型或无声模特替代。网站提供明确的「听人物原声」操作；离开该幕停止，配乐自动压低。

前 15.35 秒为英文问候和分享问题的引子：问候 → 希望大家一切顺利 → 回答收到的问题 → 与其私下回复 → 分享给其他人 → 也许有人受益。中文字幕依据本地 Whisper tiny.en 转写后整理，属于本站翻译，不是剪映识别字幕或真实「智能剪口播」处理效果。核验包括音轨非空、同文件音画时间戳、浏览器实际播放状态与转写内容；没有声称完成真人监听或逐帧口型测量。字幕末句用于网页离场转场，静音探索也可看到它。

结尾 18 秒《看见，未见》是本站概念短片，没有口播音轨，避免短蒙太奇中截断的讲话；可随网站配乐观看。

## 音乐：网站播放与开源源码分离

用户提供的 **《雨尽天明》**（原文件 `雨尽天明 (1).mp3`）已本地检查：153.704 秒、44.1 kHz、双声道、256 kbps、4,920,518 bytes，嵌入标签的 ContentProducer 为 MiniMax。用户在本次制作中明确授权用于网站播放，并明确要求**不要放进公开源码**。据此，本地网站使用 `public/media/private-soundtrack.mp3`；这不表示该音频适用项目 MIT 许可，也不授予他人复制或再分发的许可。

- **开源源码**：`.gitignore` 的 `public/media/private-*` 排除该音频；`dist/` 也被排除。公开 GitHub 源码、源码压缩包和 Release 附件不应包含该 MP3 或含该 MP3 的构建包。源码接收者可自行使用有权使用的配乐。
- **本网站部署**：维护者在部署环境单独放入已授权的 `public/media/private-soundtrack.mp3`，再执行 `npm run build`；也可通过 `VITE_AUDIO_URL` 指向维护者有权用于本站的 HTTPS 音频地址。Vite 会把它复制到 `dist/media/`，该构建产物可部署为用户授权的网站播放版本，但不要将它作为公开源码或通用素材包重新发布。音频不必进入 Git 历史。
- **从公开仓库构建**：仓库本身不含此配乐。部署者需要另行供应自己的授权音频，或保留页面可替换的音乐入口。私有文件不会由素材重建脚本下载或生成。
- **浏览器本地选曲**：通过文件选择器载入的文件仅在浏览器本地播放，不上传到服务器，也不会进入仓库。

这里的“私有音频”指与开源源码及开源授权分离；部署后浏览器需要获取音频才能播放，因此它不是防下载或访问控制机制。用户本次授权只记录在本网站中使用的范围，没有扩大为音频的通用开源许可。

本站未采用程序合成背景音乐。自动化测试在私有歌曲缺席时使用代码生成的短测试音，仅在测试网络拦截中返回，不进入正式网站。


## 原创代码与品牌

遮罩路径、字形转场、字幕位移、网页排版和素材编排由本项目实现。未使用其他参考网站的代码、文案或媒体。剪映名称及标志只用于识别所研究的产品，权利归原权利人，不适用代码 MIT 许可。

## 重建

需要 Python 3.10+ 与 FFmpeg（libx264、libwebp）。按上表文件名下载到单独目录，并比对 source-audit.json 的 SHA-256 后运行：

```bash
python3 scripts/prepare-films.py --sources /path/to/licensed-sources --ffmpeg /path/to/ffmpeg
# 只重建一幕：追加 --only nature
```

脚本不联网下载素材，不获取私有音乐；它写入 public/media/ 的派生文件。不同 FFmpeg 版本可能导致编码哈希差异。运行前重新核查来源与许可。公开源码不需要原片即可运行，已经包含本站使用的压缩片段。
