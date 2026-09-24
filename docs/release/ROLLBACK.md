# 回退方法

首选重新部署 Sites 已归档的第 2 版。版本 ID、源码提交见 baseline.json。此方法恢复旧的构建产物和音乐，无须重新构建；等待部署成功后检查公网首页。

GitHub 如需同步恢复旧源码，使用 `git revert <本次发布提交>`，提交并推送 main，不强推、不删除历史。旧 GitHub 提交为 f05b2e82605aaff2e71c728a531d7ead42bf2726；旧线上源码为 cfdae39adaf9ab458dfd4114fe98b2f734b32e77。

本次发布按 approved-manifest.json 逐项校验 src 和公开媒体，与用户确认的本地预览逐字节一致。未使用的候选审阅页面/视频不进入生产包；正式页面没有它们的入口。私人歌曲仅部署，绝不提交 GitHub。
