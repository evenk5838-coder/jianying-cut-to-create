# 人像候选 P5—P9（2026-09-24）

> 更新：用户已确认 P5，现接入独立预览；其他候选及以下筛选阶段记录保留。公网未更新。

## 本轮范围

仅增加独立人像审片页 `/portrait-candidates.html` 和旧候选页中的入口。网站主体验、现有视频、其他章节、正式仓库和公网部署均未修改。P3 / P4 保留作历史记录；新候选待用户选择后才能接入。

## 素材与授权

所有缩略图从对应视频提取。全部实际下载文件无音轨。源文件保存在本机临时审片目录，仓库预览只含摘取压缩片段，不附私人音乐。视频与缩略图不适用 MIT 代码许可。

| 编号 | 方向 / 作者 | 实际下载规格 | 预览 | 来源与许可 |
|---|---|---|---|---|
| P5 | 窗边柔光 · 长发近景 / KoolShooters | 2560×1440，24/1 fps，22.42s | 1920×1080，6.8s | [来源](https://www.pexels.com/video/close-up-of-a-pretty-woman-brushing-her-hair-8955481/) · [Pexels License](https://www.pexels.com/license/) |
| P6 | 暖光镜前 · 精致妆容 / Mixkit（页面未单列作者） | 1920×1080，24000/1001 fps，13.39s | 1920×1080，11s | [来源](https://mixkit.co/free-stock-video/a-young-beautiful-model-admired-her-new-makeup-job-in-52042/) · [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree) |
| P7 | 红发微光 · 时尚美妆 / Marcio Skull | 1920×1080，30000/1001 fps，8.01s | 1920×1080，8s | [来源](https://www.pexels.com/video/close-up-of-a-red-haired-young-woman-15769170/) · [Pexels License](https://www.pexels.com/license/) |
| P8 | 浅粉棚光 · 自然肤质 / Ron Lach | 2732×1440，25/1 fps，14.00s | 1920×1012，12s | [来源](https://www.pexels.com/video/portrait-video-of-woman-8141575/) · [Pexels License](https://www.pexels.com/license/) |
| P9 | 钴蓝背景 · 双人时装 / SHVETS production | 2560×1440，25/1 fps，9.92s | 1920×1080，9.92s | [来源](https://www.pexels.com/video/asian-women-with-eye-makeup-turning-around-8019531/) · [Pexels License](https://www.pexels.com/license/) |

Pexels 许可允许免费使用、编辑及用于网站；不得暗示出镜人物背书、转售原样素材或以令人反感的方式表现人物。P6 条目明确列为 Mixkit Stock Video Free License，可免费用于商业或个人项目；未使用 Mixkit Restricted License 的个人用途低清素材。出镜者身份不根据照片推断，选择以可见的造型、妆容、光线和构图为依据。

上述是素材库现有拍摄效果，不是剪映处理结果。未添加磨皮、滤镜或不真实的前后对比。P5 只截取开头 0–6.8s 近景，排除后段较暴露的服装构图；P7 镜头较紧，P9 为双人强彩妆，均在预览中标明取舍。

下载地址、源文件与预览 SHA256、字节数、帧率和范围见 `public/review-portraits/catalog.json`。页面标称最高分辨率不等同于本次实际下载分辨率；本清单以 ffprobe 实测为准。

## 本轮验证

- 五条预览均经 FFmpeg 完整解码，无错误。
- Vite / TypeScript 正式构建通过。
- Codex 内置 Chromium：默认桌面 1280×720 与 390×844 手机视口。五条播放均 readyState=4、currentTime 前进、无媒体错误。
- 按钮与原生控件可用；同时只播放一段，离开视口暂停；原生控件支持全屏，视频设置循环。
- 手机实测 viewport/clientWidth/scrollWidth 均为 390px；视频 350×196.875px，文字与按钮无横向溢出。
- 本轮未测试实体手机、Safari 或远程网络，预览地址只用于本机审核。
- 不自动播放、不预加载视频正文；首屏只取海报。
