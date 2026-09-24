# 2026-09-25 正式发布

- 公网：https://jianying-cut-to-create.evenk5838.chatgpt.site/
- GitHub：https://github.com/evenk5838-coder/jianying-cut-to-create
- 页面/素材发布提交：3cd8876e21a469bb7c1c0b44a84902528c74fdf6
- Sites 源码提交：caec1cb4df7ddad8f758958ada9d22d7d9fed496
- Sites 第 3 版：appgprj_6ab4e9c887b48191be2204d44374f77c~appgver_2630e09090808191a6ff851b570fb2d7
- 成功部署：appgdep_6ab54bf8842c8191a2d8546965ea2319

## 一致性与构建

已校验 src 和全部主媒体与刚确认的本地预览 SHA-256 一致，见 approved-manifest.json。无设计、文案、素材或转场改动。首轮同源完整视频包上传超时，未切换公网；随后沿用已有部署脚本，将 MP4 固定引用上述 GitHub 提交的 public/media，成功上传 6,000,640 字节发布包。页面、封面和已授权音乐由网站提供。

```sh
npm ci
node scripts/build-production.mjs --video-base https://raw.githubusercontent.com/evenk5838-coder/jianying-cut-to-create/3cd8876e21a469bb7c1c0b44a84902528c74fdf6/public/media
```

音乐只在部署工作副本的 public/media/private-soundtrack.mp3，受 .gitignore 排除；公开仓库没有该文件。独立审阅候选文件不进入生产网站。

## 线上验收

Chrome 153.0.8010.53；全新无 cookie、无登录存储的独立浏览器上下文。桌面 1440×900、手机 390×844（触摸/手机模拟，非物理手机）。公网返回 200，无登录跳转。

两种尺寸均通过：首屏地球；城市、口播、P5 人像、风景、未来和新混剪的视频加载/持续播放；五个详情标题与返回；逐段正反向转场且最多两个视频同时播放；结尾跨尾部循环；无候选链接；实际部署音乐播放/关闭；原声在同一视频中开启、配乐降至 0.0144 并恢复 0.12。未拦截或替换音乐文件。无脚本异常或 HTTP 4xx/5xx；无横向溢出。截图人工检查无文字遮挡。

数据与截图见 qa/online.json 和 qa/。声音检查验证浏览器播放时间、音轨与音量状态，不等同于声学录音测量。访问结果代表当前测试网络，不能保证所有地区/运营商都可访问 GitHub raw 和 chatgpt.site。未测试真机 Safari/Android。

## 回退

见 [ROLLBACK.md](ROLLBACK.md)。重部署保留的 Sites 第 2 版可恢复旧公网；不要重新打包私人备份并上传公开仓库。GitHub 如需回退，用 git revert 本次页面发布提交并正常推送。

## 滚动性能实测

14 秒前进/倒退滚动采样：桌面约 53.5 fps；手机尺寸加 4 倍 CPU 限速约 51.6 fps；P95 帧间隔分别 33.3/33.4 ms。最多两个视频播放，最多一组正文可见。此次测试未达到稳定 60 fps；没有据此改动已确认效果。详见 qa/performance.json。
