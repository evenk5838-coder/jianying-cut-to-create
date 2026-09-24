import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { scenes, media, official, type FeatureId } from "../content";
import { END, sequence, copyOpacity, ramp } from "../lib/sequence";
gsap.registerPlugin(ScrollTrigger);
// Reassigning even identical styles on video ancestors can invalidate compositing.
function paint(element: HTMLElement, values: Record<string, string>) {
  for (const [property, value] of Object.entries(values)) {
    if (element.style.getPropertyValue(property) !== value)
      element.style.setProperty(property, value);
  }
}

type Props = {
  reduced: boolean;
  lite: boolean;
  startSound: () => void;
  silenceSound: () => void;
  onVoice: (v: boolean) => void;
  onFeature: (id: FeatureId) => void;
  suspended: boolean;
};
export default function FilmStage({
  reduced,
  lite,
  startSound,
  silenceSound,
  onVoice,
  onFeature,
  suspended,
}: Props) {
  const suspendedRef = useRef(suspended);
  suspendedRef.current = suspended;
  const root = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]),
    layers = useRef<(HTMLDivElement | null)[]>([]),
    copies = useRef<(HTMLElement | null)[]>([]);
  const pictures = useRef<(HTMLDivElement | null)[]>([]);
  const glyph = useRef<SVGTextElement>(null),
    aperture = useRef<SVGRectElement>(null);
  const shade = useRef<HTMLDivElement>(null),
    typeMask = useRef<HTMLDivElement>(null),
    caption = useRef<HTMLDivElement>(null);
  const clock = useRef(0),
    active = useRef(0),
    scrollEnd = useRef(1),
    mediaKey = useRef("");
  const scrolling = useRef(false),
    settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paused = useRef(reduced),
    [isPaused, setPaused] = useState(reduced);
  const voice = useRef(false),
    [voicePlaying, setVoicePlaying] = useState(false);
  const [current, setCurrent] = useState(0),
    [line, setLine] = useState(""),
    [mediaError, setMediaError] = useState("");
  const [playingFinal, setPlayingFinal] = useState(false),
    [ended, setEnded] = useState(false);
  const hasFinalPlayed = useRef(false);
  const currentLabel = scenes[current].label;

  // Never starts audible playback implicitly. The original speech lives in the same video.
  const stopVoice = () => {
    const v = videos.current[3];
    if (v) {
      v.muted = true;
      v.pause();
    }
    voice.current = false;
    setVoicePlaying(false);
    onVoice(false);
  };
  const syncPlayback = () => {
    const s = sequence(clock.current);
    const visible =
      s.mix > 0 && s.mix < 1 ? [s.from, s.to] : [s.mix === 1 ? s.to : s.from];
    videos.current.forEach((v, i) => {
      if (!v) return;
      const play =
        window.scrollY <= scrollEnd.current &&
        visible.includes(i) &&
        !document.hidden &&
        !suspendedRef.current &&
        !paused.current &&
        (!scrolling.current || (i === 3 && voice.current)) &&
        (i !== 3 || voice.current) &&
        (i !== 6 || hasFinalPlayed.current);
      if (play && v.src && v.paused && !v.ended)
        void v.play().catch(() => {
          if (i === 3) stopVoice();
          if (i === 6) setPlayingFinal(false);
        });
      else if (!play && !v.paused) v.pause();
    });
  };
  useEffect(() => {
    if (suspended) stopVoice();
    syncPlayback();
    // Playback reads the current media flags from refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suspended]);
  const toggleMotion = () => {
    const v = videos.current[active.current];
    if (v?.ended && active.current !== 3) {
      v.currentTime = 0;
      paused.current = false;
      setPaused(false);
      setEnded(false);
      if (active.current === 6) hasFinalPlayed.current = true;
      syncPlayback();
      return;
    }
    paused.current = !paused.current;
    setPaused(paused.current);
    if (paused.current) stopVoice();
    syncPlayback();
  };
  const speak = async () => {
    const v = videos.current[3];
    if (!v) return;
    if (voice.current) {
      stopVoice();
      return;
    }
    v.muted = false;
    v.volume = 0.85;
    v.currentTime = 0;
    paused.current = false;
    setPaused(false);
    voice.current = true;
    try {
      await v.play();
    } catch {
      stopVoice();
      setMediaError("原声未能播放，请再点一次「听人物原声」。");
    }
  };
  const playFinal = async () => {
    const v = videos.current[6];
    if (!v) return;
    if (!v.paused) {
      v.pause();
      setPlayingFinal(false);
      return;
    }
    if (v.ended || !hasFinalPlayed.current) v.currentTime = 0;
    hasFinalPlayed.current = true;
    paused.current = false;
    setPaused(false);
    try {
      await v.play();
    } catch {
      setMediaError("短片未能播放，请重试。");
    }
  };
  const go = (x: number) =>
    window.scrollTo({
      top: (x / END) * scrollEnd.current,
      behavior: reduced ? "instant" : "smooth",
    });

  useEffect(() => {
    paused.current = reduced;
    setPaused(reduced);
    mediaKey.current = "";
    const update = (progress: number) => {
      const x = progress * END;
      clock.current = x;
      const s = sequence(x),
        t = reduced ? (s.mix >= 0.5 ? 1 : 0) : s.mix;
      if (active.current !== s.current) {
        active.current = s.current;
        setCurrent(s.current);
        setEnded(false);
        setMediaError("");
      }
      // Prepare only the approaching shot. Unset distant sources to release decoders.
      const needed =
        s.local > (s.from === 0 ? 0.12 : 0.42) && s.from < 6
          ? [s.from, s.to]
          : [s.from];
      const key = needed.join(",") + lite;
      if (mediaKey.current !== key) {
        mediaKey.current = key;
        videos.current.forEach((v, i) => {
          if (!v) return;
          if (needed.includes(i)) {
            const url = media(`${scenes[i].file}${lite ? "-mobile" : ""}.mp4`);
            if (v.getAttribute("src") !== url) {
              v.src = url;
              v.load();
            }
            const picture = pictures.current[i];
            if (picture)
              picture.style.backgroundImage = `url("${media(scenes[i].file + "-poster.webp")}")`;
          } else if (v.hasAttribute("src")) {
            v.pause();
            v.removeAttribute("src");
            v.load();
          }
        });
      }
      layers.current.forEach((layer, i) => {
        if (!layer) return;
        const picture = pictures.current[i];
        let visibility =
          i === s.from || (i === s.to && t > 0) ? "visible" : "hidden";
        let transform = "none",
          pictureTransform = "none",
          clip = "none";
        if (i === s.to && s.from !== 6 && t > 0 && t < 1) {
          // Move the overflow mask and counter-move its picture: no video zoom.
          const wipe = (axis: "X" | "Y") => {
            transform = `translate${axis}(${(1 - t) * 100}%)`;
            pictureTransform = `translate${axis}(${-(1 - t) * 100}%)`;
          };
          if (s.from === 0 || s.from === 3) wipe("Y");
          if (s.from === 4) wipe("X");
          if (s.from === 1 || s.from === 5)
            visibility = t < 0.5 ? "hidden" : "visible";
          if (s.from === 2) {
            if (lite) wipe("X");
            else {
              clip = "url(#voice-reveal)";
              const opening = ramp(t, 0.55, 1);
              glyph.current?.setAttribute(
                "transform",
                `translate(.5 .5) scale(${t * 3}) translate(-.5 -.5)`,
              );
              aperture.current?.setAttribute("x", String((1 - opening) / 2));
              aperture.current?.setAttribute("y", String((1 - opening) / 2));
              aperture.current?.setAttribute("width", String(opening));
              aperture.current?.setAttribute("height", String(opening));
            }
          }
        }
        paint(layer, {
          visibility,
          "z-index": i === s.to && s.to !== s.from ? "2" : "1",
          "clip-path": clip,
          transform,
        });
        if (picture) paint(picture, { transform: pictureTransform });
      });
      copies.current.forEach((copy, i) => {
        if (!copy) return;
        const opacity = copyOpacity(x, i);
        paint(copy, {
          opacity: String(opacity),
          visibility: opacity > 0 ? "visible" : "hidden",
          transform: reduced ? "none" : `translateY(${(1 - opacity) * 12}px)`,
        });
        if (copy.inert !== opacity < 0.85) copy.inert = opacity < 0.85;
        const hidden = String(opacity === 0);
        if (copy.getAttribute("aria-hidden") !== hidden)
          copy.setAttribute("aria-hidden", hidden);
      });
      if (shade.current) {
        const occlusion =
          s.from === 1 || s.from === 5 ? Math.sin(t * Math.PI) : 0;
        const opacity = reduced ? 0 : occlusion > 0.97 ? 1 : occlusion;
        const className = `transition-shade ${s.from === 1 ? "cloud-shadow" : "close-light"}`;
        if (shade.current.className !== className)
          shade.current.className = className;
        paint(shade.current, {
          opacity: String(opacity),
          display: opacity > 0.001 ? "block" : "none",
        });
      }
      if (typeMask.current) {
        const opacity =
          !reduced && s.from === 2 ? Math.sin(t * Math.PI) * 0.28 : 0;
        paint(typeMask.current, {
          opacity: String(opacity),
          display: opacity > 0.001 ? "flex" : "none",
          transform: `translateX(${(t - 0.5) * 28}%)`,
        });
      }
      if (caption.current) {
        const isExit = s.from === 3 && s.local > 0.68;
        caption.current.dataset.exiting = String(isExit);
        caption.current.setAttribute(
          "aria-hidden",
          String(s.current !== 3 && !isExit),
        );
        paint(caption.current, {
          opacity: String(
            isExit ? 1 - ramp(t, 0.55, 1) : s.current === 3 ? 1 : 0,
          ),
          transform: `translateY(${isExit && !reduced ? -t * 60 : 0}vh)`,
        });
      }
      stage.current?.style.setProperty("--film-progress", String(progress));
      if (stage.current?.dataset.scene !== String(s.current))
        stage.current?.setAttribute("data-scene", String(s.current));
      stage.current?.setAttribute("data-mix", s.mix.toFixed(3));
      if ((s.from !== 3 || s.mix > 0) && voice.current) stopVoice();
      syncPlayback();
    };
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Hold the last decoded frame while scrolling; resume at a settled position.
        // This avoids competing video decode/compositing work during the mask movement.
        scrolling.current = true;
        clearTimeout(settleTimer.current);
        update(self.progress);
        settleTimer.current = setTimeout(() => {
          scrolling.current = false;
          syncPlayback();
        }, 140);
      },
      onRefresh: (self) => {
        scrollEnd.current = self.end;
        update(self.progress);
      },
      onLeave: () => videos.current.forEach((v) => v?.pause()),
      onEnterBack: () => syncPlayback(),
    });
    scrollEnd.current = trigger.end;
    update(trigger.progress);
    const visibility = () => {
      if (document.hidden) stopVoice();
      syncPlayback();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      trigger.kill();
      clearTimeout(settleTimer.current);
      scrolling.current = false;
      document.removeEventListener("visibilitychange", visibility);
      videos.current.forEach((v) => v?.pause());
    };
    // Media flags are refs so scrolling doesn't rerender every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, lite]);

  return (
    <section
      className={`film-journey ${reduced ? "reduced" : ""}`}
      ref={root}
      aria-label="创作影像之旅"
    >
      <div
        className={`film-stage ${playingFinal ? "is-watching" : ""}`}
        ref={stage}
      >
        <svg className="mask-defs" aria-hidden="true">
          <defs>
            <clipPath id="voice-reveal" clipPathUnits="objectBoundingBox">
              <text
                ref={glyph}
                x=".5"
                y=".67"
                textAnchor="middle"
                fontSize=".6"
                fontWeight="900"
              >
                表达
              </text>
              <rect ref={aperture} x=".5" y=".5" width="0" height="0" />
            </clipPath>
          </defs>
        </svg>
        <div className="visual-stage" aria-hidden="true">
          {scenes.map((s, i) => (
            <div
              key={s.id}
              className={`film-layer film-${s.id}`}
              ref={(e) => {
                layers.current[i] = e;
              }}
            >
              <div
                className="film-picture"
                ref={(e) => {
                  pictures.current[i] = e;
                }}
                style={{
                  backgroundImage:
                    i === 0 ? `url(${media("earth-poster.webp")})` : undefined,
                  backgroundPosition: s.position,
                }}
              >
                <video
                  ref={(e) => {
                    videos.current[i] = e;
                  }}
                  data-film={s.id}
                  preload="none"
                  muted
                  playsInline
                  loop={false}
                  style={{ objectPosition: s.position }}
                  onPlaying={() => {
                    if (i === 3) {
                      setVoicePlaying(true);
                      onVoice(true);
                    }
                    if (i === 6) setPlayingFinal(true);
                  }}
                  onPause={() => {
                    if (i === 3) {
                      setVoicePlaying(false);
                      onVoice(false);
                    }
                    if (i === 6) setPlayingFinal(false);
                  }}
                  onEnded={() => {
                    if (i === active.current) setEnded(true);
                    if (i === 3) stopVoice();
                    if (i === 6) setPlayingFinal(false);
                  }}
                  onError={() => {
                    if (videos.current[i]?.hasAttribute("src"))
                      setMediaError(
                        "影像暂时无法加载，已保留静帧。可继续滚动或稍后重试。",
                      );
                  }}
                  onTimeUpdate={(e) => {
                    if (i === 3) {
                      const t = e.currentTarget.currentTime;
                      setLine(
                        t < 3.54
                          ? "大家下午好！"
                          : t < 5.2
                            ? "希望你们今天过得不错。"
                            : t < 8.72
                              ? "我想回答一个收到的问题。"
                              : t < 11.2
                                ? "与其私下回复，"
                                : t < 14.24
                                  ? "为什么不把它分享给其他人？"
                                  : "也许，有人会受益。",
                      );
                    }
                  }}
                />
              </div>
            </div>
          ))}
          <div className="film-scrim" />
          <div ref={shade} className="transition-shade" />
          <div ref={typeMask} className="type-transition">
            表达
          </div>
        </div>
        {scenes.map((s, i) => (
          <article
            className={`scene-copy copy-${s.id}`}
            key={s.id}
            ref={(e) => {
              copies.current[i] = e;
            }}
            aria-label={s.label}
          >
            <p className="eyebrow">{s.label}</p>
            {i === 0 ? (
              <h1>
                {s.title.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </h1>
            ) : (
              <h2>
                {s.title.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </h2>
            )}
            <p className="scene-description">{s.description}</p>
            {i === 0 ? (
              <div className="scene-actions">
                <button
                  className="primary"
                  onClick={() => {
                    startSound();
                    go(1.2);
                  }}
                >
                  进入体验并开启声音 <ArrowDown size={17} />
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    silenceSound();
                    go(1.2);
                  }}
                >
                  静音探索 <ArrowDown size={16} />
                </button>
              </div>
            ) : i === 3 ? (
              <div className="voice-actions">
                <button
                  className="primary voice-toggle"
                  onClick={() => void speak()}
                >
                  {voicePlaying ? <VolumeX size={17} /> : <Volume2 size={17} />}{" "}
                  {voicePlaying ? "关闭人物原声" : "听人物原声"}
                </button>
                <button
                  className="capability-link"
                  onClick={() => onFeature("speech")}
                  aria-label="了解智能剪口播"
                >
                  了解相关能力 <ArrowUpRight size={15} />
                </button>
              </div>
            ) : i === 6 ? (
              <div className="scene-actions">
                <button className="primary" onClick={() => void playFinal()}>
                  {playingFinal ? <Pause size={17} /> : <Play size={17} />}{" "}
                  {playingFinal ? "暂停短片" : "观看完整短片"}
                </button>
                <a
                  href={official}
                  target="_blank"
                  rel="noreferrer"
                  className="text-button"
                >
                  用剪映开始创作 <ArrowUpRight size={17} />
                </a>
              </div>
            ) : (
              <button
                className="capability-link"
                onClick={() => onFeature(s.id as FeatureId)}
                aria-label={`了解${s.label.split(" · ")[0]}相关能力`}
              >
                了解相关能力 <ArrowUpRight size={15} />
              </button>
            )}
            {i === 6 && (
              <p className="scene-credit">《看见，未见》· 18 秒短片</p>
            )}
          </article>
        ))}
        <div className="speech-caption" ref={caption}>
          <span className="live-caption">
            {line || "英文原声 · 点击按钮聆听"}
          </span>
          <span className="exit-caption">也许，有人会受益。</span>
        </div>
        <div className="stage-bottom">
          <span>
            {current === 0 ? "向下滚动，让作品继续" : currentLabel}
            <ArrowDown size={14} />
          </span>
          <button
            aria-label={
              ended
                ? "重播动态画面"
                : isPaused
                  ? "播放动态画面"
                  : "暂停动态画面"
            }
            onClick={toggleMotion}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>
              {ended ? "重播画面" : isPaused ? "画面已暂停" : "暂停画面"}
            </span>
          </button>
          {current === 6 && (
            <button aria-label="重新探索" onClick={() => go(0)}>
              <RotateCcw size={16} />
            </button>
          )}
        </div>
        {mediaError && (
          <p className="media-status" role="status">
            {mediaError}
          </p>
        )}
        <div className="reading-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
