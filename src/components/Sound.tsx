import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music2, X, Upload } from "lucide-react";
import { media } from "../content";

export default function Sound({
  startSignal,
  muteSignal,
  duck,
  onStateChange,
}: {
  startSignal: number;
  muteSignal: number;
  duck: boolean;
  onStateChange: (state: {
    playing: boolean;
    pending: boolean;
    status: string;
  }) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [panel, setPanel] = useState(false);
  const [status, setStatus] = useState("点击开启声音");
  const [name, setName] = useState("雨尽天明");
  const [volume, setVolume] = useState(0.12);
  const objectUrl = useRef<string>("");
  const attempted = useRef(0);
  const autoplayAttempted = useRef(false),
    wantsSound = useRef(false),
    request = useRef(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const remember = (value: "on" | "off") => {
    try {
      localStorage.setItem("jianying-sound", value);
    } catch {
      /* Storage can be disabled. */
    }
  };
  const stop = () => {
    request.current++;
    wantsSound.current = false;
    audio.current?.pause();
    setPlaying(false);
    setPending(false);
    setAutoplayBlocked(false);
    setStatus("声音已关闭");
    remember("off");
  };
  useEffect(() => {
    onStateChange({ playing, pending, status });
  }, [playing, pending, status, onStateChange]);
  const src = import.meta.env.VITE_AUDIO_URL || media("private-soundtrack.mp3");
  const start = async (automatic = false) => {
    const el = audio.current;
    if (!el) return;
    const id = ++request.current;
    wantsSound.current = true;
    setStatus("正在开启声音…");
    setPending(true);
    try {
      el.volume = duck ? volume * 0.12 : volume;
      await el.play();
      if (id !== request.current || !wantsSound.current) return;
      setAutoplayBlocked(false);
      if (!automatic) remember("on");
    } catch (error) {
      if (id !== request.current) return;
      wantsSound.current = false;
      setPlaying(false);
      setPending(false);
      if (
        error instanceof DOMException &&
        error.name === "AbortError" &&
        !el.error
      ) {
        setStatus("声音已关闭");
        return;
      }
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setAutoplayBlocked(true);
        setStatus("浏览器未能自动播放；点击声音按钮即可开启音乐。");
      } else {
        setStatus("音乐暂时无法加载，可点击声音按钮重试。页面仍可正常浏览。");
        if (!automatic) setPanel(true);
      }
    }
  };
  useEffect(() => {
    if (autoplayAttempted.current) return;
    autoplayAttempted.current = true;
    try {
      if (localStorage.getItem("jianying-sound") === "off") return;
    } catch {
      /* Try playback without persistence. */
    }
    void start(true);
    // Try once on entry. Browser media events remain the source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (muteSignal > 0) stop();
    // The silent entry is an explicit user choice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muteSignal]);
  useEffect(() => {
    if (startSignal > attempted.current) {
      attempted.current = startSignal;
      void start();
    }
    // A deliberate user gesture increments startSignal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSignal]);
  useEffect(() => {
    if (audio.current) audio.current.volume = duck ? volume * 0.12 : volume;
  }, [volume, duck]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) audio.current?.pause();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);
  return (
    <div className="sound-dock">
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
      <audio
        ref={audio}
        src={src}
        loop
        preload="none"
        onPlaying={() => {
          if (!wantsSound.current) {
            audio.current?.pause();
            return;
          }
          setAutoplayBlocked(false);
          setPlaying(true);
          setPending(false);
          setStatus("正在播放");
        }}
        onPause={() => {
          setPlaying(false);
          setPending(false);
          setStatus(
            audio.current?.error
              ? "音乐暂时无法加载，可点击声音按钮重试。页面仍可正常浏览。"
              : "声音已关闭",
          );
        }}
        onWaiting={() => {
          setPlaying(false);
          setPending(!audio.current?.paused);
          setStatus("音乐缓冲中…");
        }}
        onError={() => {
          setPlaying(false);
          setPending(false);
          setStatus("音乐暂时无法加载，可点击声音按钮重试。页面仍可正常浏览。");
        }}
      />
      {panel && (
        <div className="sound-panel">
          <div className="panel-heading">
            <span>声音空间</span>
            <button aria-label="关闭声音设置" onClick={() => setPanel(false)}>
              <X size={17} />
            </button>
          </div>
          <p>{name}</p>
          <small>{status}</small>
          <label className="volume-label">
            音量 <span>{Math.round(volume * 100)}%</span>
            <input
              aria-label="背景音乐音量"
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
            />
          </label>
          <label className="file-choice">
            <Upload size={14} /> 选择本机音乐
            <input
              aria-label="选择本机音乐"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f || !audio.current) return;
                stop();
                if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
                objectUrl.current = URL.createObjectURL(f);
                audio.current.src = objectUrl.current;
                setName(f.name);
                setStatus("已选择，点击声音按钮播放");
              }}
            />
          </label>
          <small>本机音乐只在浏览器内播放，不上传。</small>
        </div>
      )}
      <button
        className={`sound-toggle ${playing ? "is-playing" : ""}`}
        aria-label={
          pending ? "取消音乐加载" : playing ? "关闭背景音乐" : "开启背景音乐"
        }
        aria-pressed={playing}
        onClick={() =>
          pending || (audio.current && !audio.current.paused)
            ? stop()
            : void start()
        }
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>
          {pending
            ? "音乐缓冲中"
            : playing
              ? "配乐开启"
              : autoplayBlocked
                ? "一键开启声音"
                : "开启声音"}
        </span>
        <i className="equalizer" aria-hidden="true">
          <b />
          <b />
          <b />
          <b />
        </i>
      </button>
      <button
        className="sound-settings"
        aria-label="音乐设置与换曲"
        aria-expanded={panel}
        onClick={() => setPanel(!panel)}
      >
        <Music2 size={15} />
      </button>
    </div>
  );
}
