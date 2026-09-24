import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X, Volume2, VolumeX } from "lucide-react";
import FilmStage from "./components/FilmStage";
import Sound from "./components/Sound";
import {
  credits,
  featureDetails,
  media,
  official,
  type FeatureId,
} from "./content";

export default function App() {
  const [reduced, setReduced] = useState(
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [lite, setLite] = useState(
    matchMedia("(max-width: 760px)").matches ||
      (navigator.hardwareConcurrency || 8) <= 4,
  );
  const [muteSignal, setMuteSignal] = useState(0);
  const [musicState, setMusicState] = useState({
    playing: false,
    pending: false,
    status: "点击开启声音",
  });
  const [soundSignal, setSoundSignal] = useState(0),
    [voice, setVoice] = useState(false),
    [panel, setPanel] = useState<FeatureId | "credits" | null>(null);
  const detail = panel && panel !== "credits" ? featureDetails[panel] : null;
  const returnY = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null),
    returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(q.matches);
    q.addEventListener("change", change);
    return () => q.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (panel) {
      returnY.current = window.scrollY;
      returnFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
      returnFocus.current?.focus({ preventScroll: true });
      if (returnFocus.current) window.scrollTo(0, returnY.current);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);
  return (
    <>
      <a className="skip-link" href="#about">
        跳过影像，查看作品说明
      </a>
      <header className="site-header">
        <a className="project-wordmark" href="#" aria-label="回到开场">
          创作，无界<span>A JIANYING CONCEPT</span>
        </a>
        <div className="brand-block">
          <a
            href={official}
            target="_blank"
            rel="noreferrer"
            className="brand"
            aria-label="剪映官网"
          >
            <svg viewBox="0 0 42 32" role="img" aria-label="剪映标志">
              <path
                d="M5 5h31L6 26h30M6 5l30 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
            </svg>
            <b>剪映</b>
          </a>
          <span>独立制作 · 非官方概念作品</span>
        </div>
      </header>
      <main>
        <FilmStage
          reduced={reduced}
          lite={lite}
          startSound={() => setSoundSignal((v) => v + 1)}
          silenceSound={() => setMuteSignal((v) => v + 1)}
          onVoice={setVoice}
          onFeature={setPanel}
          suspended={panel !== null}
        />
      </main>
      <footer id="about" tabIndex={-1}>
        <div className="footer-intro">
          <p className="eyebrow">关于这次创作</p>
          <h2>
            工具提供可能，
            <br />
            表达来自你。
          </h2>
          <p>
            一段关于旅行、人物与想象的影像旅程。
            <br />
            这是独立制作的产品研究与交互设计作品，与剪映官方无隶属或合作关系。
          </p>
          <button className="footer-link" onClick={() => setPanel("credits")}>
            素材来源与使用说明 <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="footer-notes">
          <p>从风景、人物到城市与想象，让每一种题材找到适合自己的表达。</p>
          <p>选择适合设备的播放方式，按照自己的节奏探索。</p>
          <div className="experience-options">
            <label>
              <input
                type="checkbox"
                checked={lite}
                onChange={(e) => setLite(e.target.checked)}
              />
              轻量视频
            </label>
            <label>
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />
              减少动态效果
            </label>
          </div>
          <a href={official} target="_blank" rel="noreferrer">
            前往剪映官网 <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 独立概念作品</span>
          <span>影像 · NASA Johnson / Pexels 创作者</span>
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: reduced ? "instant" : "smooth",
              })
            }
          >
            回到开场 ↑
          </button>
        </div>
        <div className="site-disclosure">
          <p>
            本站为独立制作的非官方概念作品，与剪映无隶属或合作关系。影像来自
            NASA Johnson 与 Pexels
            创作者，由本站剪辑编排；转场和字幕为网页展示设计，并非剪映实际处理结果，未来城市也不是剪映生成的成果。风景色彩切换为同一素材的网页调色示意，不是剪映画质增强的实测对比。人物、素材作者及画面中的品牌不为产品背书。
          </p>
          <p>
            功能说明依据剪映官方公开介绍，主要为专业版语境；实际功能、会员与额度以客户端为准。配乐《雨尽天明》由用户通过
            MiniMax 制作并授权本站播放，不随代码开源。第三方素材适用各自许可。
          </p>
        </div>
      </footer>
      <Sound
        startSignal={soundSignal}
        muteSignal={muteSignal}
        duck={voice}
        onStateChange={setMusicState}
      />
      <dialog
        ref={dialog}
        className={detail ? "feature-dialog" : ""}
        onCancel={() => setPanel(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setPanel(null);
        }}
        aria-labelledby="detail-title"
      >
        <div className="dialog-tools">
          <button
            className="dialog-sound"
            aria-label={
              musicState.pending
                ? "取消音乐加载"
                : musicState.playing
                  ? "关闭背景音乐"
                  : "开启背景音乐"
            }
            aria-pressed={musicState.playing}
            onClick={() =>
              musicState.playing || musicState.pending
                ? setMuteSignal((v) => v + 1)
                : setSoundSignal((v) => v + 1)
            }
          >
            {musicState.playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
            {musicState.pending
              ? "取消加载"
              : musicState.playing
                ? "关闭配乐"
                : "开启配乐"}
          </button>
          <span role="status" className="sr-only">
            {musicState.status}
          </span>
          <button
            className="close-sheet"
            aria-label={detail ? "关闭功能详情" : "关闭来源说明"}
            onClick={() => setPanel(null)}
          >
            <X />
          </button>
        </div>
        {detail && panel !== "credits" ? (
          <article className="feature-sheet" data-feature={panel}>
            <figure className="feature-visual">
              <img src={media(`${panel}-poster.webp`)} alt={detail.imageAlt} />
              <figcaption>{detail.visualTitle}</figcaption>
            </figure>
            <div className="feature-text">
              <p className="eyebrow">{detail.subtitle}</p>
              <h2 id="detail-title">{detail.title}</h2>
              <p className="feature-intro">{detail.description}</p>
              <ul>
                {detail.capabilities.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <h3>适合怎样的创作</h3>
              <p>{detail.scenarios}</p>
              <a
                href={official}
                target="_blank"
                rel="noreferrer"
                className="official-feature"
              >
                在剪映官网了解功能 <ArrowUpRight size={15} />
              </a>
              <button
                className="primary feature-return"
                onClick={() => setPanel(null)}
              >
                返回原板块
              </button>
            </div>
          </article>
        ) : (
          <div className="source-sheet">
            <p className="eyebrow">影像与音乐</p>
            <h2 id="detail-title">素材来源与使用说明</h2>
            <p>
              完整来源及许可保留在项目文档。以下链接可查看每段影像的原始页面；素材不适用本站代码的
              MIT 许可证。
            </p>
            <div className="credit-list">
              {credits.map(([name, work, url]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  <span>{work}</span>
                  {name} ↗
                </a>
              ))}
            </div>
            <p>
              <a
                href="https://www.pexels.com/license/"
                target="_blank"
                rel="noreferrer"
              >
                Pexels License ↗
              </a>{" "}
              ·{" "}
              <a
                href="https://www.nasa.gov/nasa-brand-center/images-and-media/"
                target="_blank"
                rel="noreferrer"
              >
                NASA 使用说明 ↗
              </a>
            </p>
            <p>
              《雨尽天明》仅授权网站播放，不随公开源码分发。本机选曲只在当前浏览器使用。
            </p>
            <button
              className="primary feature-return"
              onClick={() => setPanel(null)}
            >
              返回页面
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
