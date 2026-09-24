# 运行、部署与音乐配置

本站是 React + Vite 静态应用，无后端、登录、数据库或 AI 服务端密钥。构建产物是 `dist/`。以下是可执行的部署方法，不表示这些平台已完成发布。

## 本地构建

需要 Node.js 22.12+（22 LTS）与 npm。Vite 7 的兼容范围也包含 Node.js 20.19+。

```bash
npm ci
npm run dev
```

开发地址为 http://127.0.0.1:5173 。构建和检查产物：

```bash
npm run build
npm run preview -- --port 4173
```

预览地址为 http://127.0.0.1:4173 。`npm run build` 先做 TypeScript 检查，再构建生产资源。[Vite 官方说明](https://vite.dev/guide/static-deploy.html)指出，preview 是本地预览服务器，生产环境应托管 `dist/`。

## 路径配置

`vite.config.ts` 读取环境变量 `BASE_PATH`，未指定时用相对路径 `./`。`src/content.ts` 通过 Vite 的 `BASE_URL` 定位媒体。请在构建时确定最终部署位置。

| 访问位置 | 构建环境变量 |
| --- | --- |
| Netlify、Vercel 或自有域名根目录 | `BASE_PATH=/` |
| GitHub 项目页 `https://用户名.github.io/仓库名/` | `BASE_PATH=/仓库名/` |
| GitHub 用户页 `https://用户名.github.io/` | `BASE_PATH=/` |

例如在 macOS / Linux 中验证子目录构建：

```bash
BASE_PATH=/jianying-concept/ npm run build
npm run preview -- --port 4173
```

随后打开 http://127.0.0.1:4173/jianying-concept/ 。修改部署路径后重新构建，不能只移动旧产物。

## GitHub Pages

仓库提供 [deploy-pages.yml](examples/deploy-pages.yml) 示例；需要 GitHub Pages 时，将其复制到 `.github/workflows/deploy-pages.yml` 并开启相应权限。它在 `main` 分支推送或手动触发时，使用 Node.js 22 执行 `npm ci`、`npm run build`，再发布 `dist/`。默认 `BASE_PATH` 自动设为 `/仓库名/`。

1. 将项目源码推送到 GitHub；提交 `package-lock.json`，排除 `node_modules/`、`dist/` 和私有音乐。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 若使用用户页或自定义域名，在 **Settings → Secrets and variables → Actions → Variables** 添加仓库变量 `BASE_PATH`，值为 `/`。普通项目页不用添加。
4. 如需外部音乐，在同一处添加仓库变量 `VITE_AUDIO_URL`，值为授权音频的 HTTPS URL。
5. 推送到 `main`，或在 Actions 中手动运行 **Deploy to GitHub Pages**。工作流成功后，使用部署步骤返回的真实 URL 检查网站。

若主分支名不是 `main`，先修改工作流的 `on.push.branches`。仓库只有开启 Pages 后才会发布；工作流文件自身不会创建 GitHub 仓库或配置域名。工作流权限仅用于读取源码与部署 Pages，且不会在 pull request 事件中自动发布。见 [GitHub 官方自定义工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## Netlify

在 Netlify 导入 Git 仓库，构建命令设为 `npm run build`，发布目录设为 `dist`，Node 版本使用 22，环境变量 `BASE_PATH=/`。需要音乐时添加 `VITE_AUDIO_URL`，再发起部署；先检查平台生成的预览地址。也可在本地构建后上传 `dist/`。这是单页面锚点导航项目，没有需要服务器重写的前端路由。见 [Netlify 的 Vite 部署说明](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)。

## Vercel

在 Vercel 导入 Git 仓库，Framework Preset 选择 **Vite**，Build Command 为 `npm run build`，Output Directory 为 `dist`，Node 版本使用 22。设置 `BASE_PATH=/`；需要音乐时添加 `VITE_AUDIO_URL`。部署后在预览 URL 完成检查，再使用正式域名。见 [Vercel 的 Vite 部署说明](https://vercel.com/docs/frameworks/frontend/vite)。

## 用户音乐：部署和源码分离

用户明确授权《雨尽天明》**仅供网站播放，不进入公开源码**。本项目的 `.gitignore` 排除 `public/media/private-*`；本地文件 `public/media/private-soundtrack.mp3` 因而不会随正常 Git 提交上传。`dist/` 也被排除。

### 方式 A：外部托管，适合公开 Git 仓库的 CI

将已授权音频单独放在允许本站使用的 HTTPS 静态媒体托管位置，在部署平台配置构建环境变量：

```text
VITE_AUDIO_URL=https://你的媒体域名/已授权音乐.mp3
```

然后重新构建。音频地址需允许浏览器直接读取，正确返回音频类型，最好支持范围请求。它是公开播放地址，会进入前端构建产物，不应填写 API 密钥或其他秘密。GitHub Pages 工作流已经读取同名仓库变量；音乐文件不通过 Git 仓库或 npm 下载。

### 方式 B：构建后仅注入部署包

不设置 `VITE_AUDIO_URL`，应用就使用 `BASE_PATH` 下的 `media/private-soundtrack.mp3`。先构建，再把本地授权文件放入构建目录：

```bash
npm run build
cp '/本机授权音频的绝对路径/雨尽天明 (1).mp3' 'dist/media/private-soundtrack.mp3'
npm run preview -- --port 4173
```

检查播放后，仅将 `dist/` 上传到目标网站托管服务。不要执行 `git add -f` 添加私有音频；不要将这个含音乐的部署包附在 GitHub Release 或作为开源源码压缩包。再次构建会重建 `dist/`，应按需要重新注入。若本机已有被忽略的 `public/media/private-soundtrack.mp3`，Vite 会在构建时自动复制它到部署目录；该规则不改变音乐的许可边界。

公开仓库的 GitHub Actions 无法取得只存在于用户电脑的音乐；部署工作流应采用方式 A，或者保持静音。本站可在缺少音乐时正常探索；声音面板提供本机选曲，只在浏览器内播放，无文件上传。当前没有把程序合成音景作为替代音乐。

### 公开源码交付前检查

在项目已经初始化 Git 的情况下执行：

```bash
git check-ignore public/media/private-soundtrack.mp3
git ls-files public/media/private-soundtrack.mp3
git diff --cached --name-only
```

第一条应显示被忽略的路径；第二条应无输出；第三条用于确认待提交清单没有音乐。若文件曾经被追踪，仅增加 `.gitignore` 不会移除已有追踪或历史，应在发布仓库前解决。

## 部署后的检查

确认首页与章节刷新可达，脚本、WebP、MP4 地址均无 404；用桌面与手机宽度前进、回退、打开来源说明和关闭弹窗。测试声音启用、暂停、音乐缺失及本机换曲，切换简化画质和减少动态效果，播放结尾短片。记录真实设备、浏览器、网络条件与性能结果，见 [验证报告](QA_REPORT.md)。代码构建成功、平台任务成功与网站实际可用是三个不同的检查点。

## 正式站的媒体分离

网站可通过构建变量 `VITE_VIDEO_BASE_URL` 指向不含私有音乐的 MP4 静态目录。未设置时使用本地 `public/media/`，因此源码克隆后可直接运行。海报和网站配乐仍走本站地址。正式发布可使用公开 GitHub 仓库的固定提交文件地址，避免把完整影片重复上传到应用部署包；媒体固定到提交，不随 main 分支变化。

`VITE_VIDEO_BASE_URL` 只影响 `.mp4`，不会改写音乐 URL；用户配乐只存在于部署环境的忽略文件。若选用外部媒体，生成部署包时可移除 `dist/media/*.mp4`，保留所有 WebP、网站资源和授权音乐。外部静态服务必须支持 HTTPS 与浏览器视频加载。高流量部署可替换成自有对象存储/CDN。

媒体分离生产构建示例（提交号应替换为已发布的真实提交）：

```bash
node scripts/build-production.mjs --video-base https://raw.githubusercontent.com/OWNER/REPO/COMMIT/public/media
```

脚本只从生成的 dist 中移除已配置外部地址的 MP4，不修改 public 中的源码素材；音乐与海报保留在部署包。普通 `npm run build` 仍生成可独立部署的完整网站。
