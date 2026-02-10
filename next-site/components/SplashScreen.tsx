"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MousePointer } from "lucide-react";
import WebGpuBackdrop from "@/components/WebGpuBackdrop";
import styles from "@/app/splash.module.css";

const PROJECTS = [
  { name: "LMMs-Eval", href: "https://github.com/EvolvingLMMs-Lab/lmms-eval" },
  { name: "LLaVA-OneVision", href: "https://arxiv.org/abs/2408.03326" },
  { name: "LMMs-Engine", href: "https://github.com/EvolvingLMMs-Lab/lmms-engine" },
  {
    name: "OneVision-Encoder",
    href: "https://github.com/EvolvingLMMs-Lab/OneVision-Encoder",
  },
  {
    name: "Multimodal-SAE",
    href: "https://github.com/EvolvingLMMs-Lab/multimodal-sae",
  },
];

const CONNECT_LINKS = [
  { name: "Twitter", href: "https://x.com/Brian_Bo_Li" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/brianbo1121/" },
  { name: "GitHub", href: "https://github.com/luodian" },
  { name: "Google Scholar", href: "https://scholar.google.com/citations?user=1_zc1-IAAAAJ" },
];

const STORY_PATH = "/compression_2025/";
const STORY_EXCERPT =
  "“那就永远尝试。这就是意识存在的方式，Noah。不是抵达，而是趋近。不是理解，而是追问。不是压缩成一个最终的答案，而是在不可压缩的关系中持续展开。”";

const ARCHIVE_PATH = "/inside";
const STATUS_POOL = ["learning", "thinking", "coding", "sleeping"] as const;
const SOMETHING_SUFFIXES = ["new", "superb"] as const;

function pickWeighted<T extends string>(
  options: Array<{ value: T; weight: number }>
): T {
  const total = options.reduce((acc, item) => acc + item.weight, 0);
  let r = Math.random() * total;
  for (const item of options) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return options[0].value;
}

function statusByLocalTime(date: Date): (typeof STATUS_POOL)[number] {
  const hour = date.getHours();

  if (hour >= 0 && hour < 6) {
    return pickWeighted([
      { value: "sleeping", weight: 0.72 },
      { value: "thinking", weight: 0.18 },
      { value: "learning", weight: 0.06 },
      { value: "coding", weight: 0.04 },
    ]);
  }

  if (hour >= 6 && hour < 9) {
    return pickWeighted([
      { value: "learning", weight: 0.45 },
      { value: "thinking", weight: 0.33 },
      { value: "coding", weight: 0.14 },
      { value: "sleeping", weight: 0.08 },
    ]);
  }

  if (hour >= 9 && hour < 12) {
    return pickWeighted([
      { value: "coding", weight: 0.5 },
      { value: "learning", weight: 0.3 },
      { value: "thinking", weight: 0.18 },
      { value: "sleeping", weight: 0.02 },
    ]);
  }

  if (hour >= 12 && hour < 14) {
    return pickWeighted([
      { value: "thinking", weight: 0.42 },
      { value: "coding", weight: 0.34 },
      { value: "learning", weight: 0.2 },
      { value: "sleeping", weight: 0.04 },
    ]);
  }

  if (hour >= 14 && hour < 19) {
    return pickWeighted([
      { value: "coding", weight: 0.56 },
      { value: "learning", weight: 0.25 },
      { value: "thinking", weight: 0.17 },
      { value: "sleeping", weight: 0.02 },
    ]);
  }

  if (hour >= 19 && hour < 23) {
    return pickWeighted([
      { value: "thinking", weight: 0.45 },
      { value: "coding", weight: 0.37 },
      { value: "learning", weight: 0.13 },
      { value: "sleeping", weight: 0.05 },
    ]);
  }

  return pickWeighted([
    { value: "sleeping", weight: 0.48 },
    { value: "thinking", weight: 0.28 },
    { value: "coding", weight: 0.14 },
    { value: "learning", weight: 0.1 },
  ]);
}

function nowInSingapore(): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Singapore",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type OrbitCursor = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  opacity: number;
  scale: number;
  isTrail: boolean;
};

export default function SplashScreen() {
  const router = useRouter();
  const vibeZoneRef = useRef<HTMLDivElement | null>(null);
  const vibeOrbitRef = useRef<HTMLSpanElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("00:00:00");
  const [status, setStatus] = useState<(typeof STATUS_POOL)[number]>("thinking");
  const [vibeActive, setVibeActive] = useState(false);
  const [somethingHovered, setSomethingHovered] = useState(false);
  const [somethingSuffixIndex, setSomethingSuffixIndex] = useState(0);
  const [storyExcerptOpen, setStoryExcerptOpen] = useState(false);
  const [storyLinkArmed, setStoryLinkArmed] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [webGpuReady, setWebGpuReady] = useState(false);
  const somethingSuffix = SOMETHING_SUFFIXES[somethingSuffixIndex];
  const orbitCursors = useMemo<OrbitCursor[]>(() => {
    const cursors: OrbitCursor[] = [];
    const circles = lowPowerMode ? [130, 170, 210] : [140, 180, 220, 260];
    const cursorsPerCircle = lowPowerMode ? [6, 9, 12] : [8, 12, 16, 20];
    const trailDepth = lowPowerMode ? 1 : 2;

    circles.forEach((radius, circleIndex) => {
      const count = cursorsPerCircle[circleIndex];
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (Math.atan2(y, x) * 180) / Math.PI;

        cursors.push({
          id: `cursor-${circleIndex}-${i}`,
          x,
          y,
          delay: circleIndex * 0.01 + i * 0.002,
          rotation,
          isTrail: false,
          opacity: 1,
          scale: 1,
        });

        for (let t = 1; t <= trailDepth; t += 1) {
          cursors.push({
            id: `cursor-${circleIndex}-${i}-trail-${t}`,
            x,
            y,
            delay: circleIndex * 0.01 + i * 0.002 + t * 0.008,
            rotation,
            isTrail: true,
            opacity: 1 - t * 0.3,
            scale: 1 - t * 0.2,
          });
        }
      }
    });

    return cursors;
  }, [lowPowerMode]);

  useEffect(() => {
    setMounted(true);
    setTime(nowInSingapore());
    setStatus(statusByLocalTime(new Date()));

    const clockTick = () => setTime(nowInSingapore());
    clockTick();
    const clockInterval = setInterval(clockTick, 1000);

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" ||
        event.key === "." ||
        event.key === ">" ||
        event.key === "ArrowRight"
      ) {
        router.push(ARCHIVE_PATH);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearInterval(clockInterval);
    };
  }, [router]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const reducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncViewport = () => {
      const mobile = mq.matches;
      const navWithMemory = navigator as Navigator & { deviceMemory?: number };
      const cores = navigator.hardwareConcurrency ?? 8;
      const memory = navWithMemory.deviceMemory ?? 8;
      const lowPower = mobile || cores <= 4 || memory <= 4 || reducedMotionMq.matches;
      setIsMobileViewport(mobile);
      setLowPowerMode(lowPower);
      if (!mobile) {
        setStoryLinkArmed(false);
        setStoryExcerptOpen(false);
      }
    };

    syncViewport();
    mq.addEventListener("change", syncViewport);
    reducedMotionMq.addEventListener("change", syncViewport);
    return () => {
      mq.removeEventListener("change", syncViewport);
      reducedMotionMq.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!somethingHovered) {
      setSomethingSuffixIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setSomethingSuffixIndex((index) => (index + 1) % SOMETHING_SUFFIXES.length);
    }, lowPowerMode ? 1900 : 1500);
    return () => window.clearInterval(interval);
  }, [somethingHovered, lowPowerMode]);

  const placeVibe = (clientX: number, clientY: number) => {
    if (!vibeZoneRef.current || !vibeOrbitRef.current) return;
    const rect = vibeZoneRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    vibeOrbitRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const isWithinTitle = (clientX: number, clientY: number) => {
    const rect = titleRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  return (
    <main className={`${styles.shell} ${webGpuReady ? styles.shellWebGpu : ""}`}>
      <WebGpuBackdrop className={styles.webgpuOverlay} onReadyChange={setWebGpuReady} />
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />

      <section className={styles.canvas} aria-label="Splash intro">
        <header className={styles.hero}>
          <div
            ref={vibeZoneRef}
            className={styles.titleVibeZone}
            onPointerEnter={(event) => {
              if (!isWithinTitle(event.clientX, event.clientY)) return;
              setVibeActive(true);
              placeVibe(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (!isWithinTitle(event.clientX, event.clientY)) {
                setVibeActive(false);
                return;
              }
              if (!vibeActive) setVibeActive(true);
              placeVibe(event.clientX, event.clientY);
            }}
            onPointerLeave={() => setVibeActive(false)}
          >
            <h1 ref={titleRef} className={styles.title}>
              <span className={styles.titleLine}>Brian is building</span>
              <span
                className={styles.titleLineAccent}
                onPointerEnter={(event) => {
                  if (event.pointerType === "touch") return;
                  setSomethingSuffixIndex(0);
                  setSomethingHovered(true);
                }}
                onPointerLeave={() => setSomethingHovered(false)}
              >
                <span className={styles.titleLineAccentMain}>something</span>
                <span className={styles.titleLineAccentSuffixSlot}>
                  <AnimatePresence initial={false} mode="wait">
                    {somethingHovered ? (
                      <motion.span
                        key={somethingSuffix}
                        className={styles.titleLineAccentSuffix}
                        initial={{ opacity: 0, y: "0.52em", scale: 0.985 }}
                        animate={{ opacity: 1, y: "0em", scale: 1 }}
                        exit={{ opacity: 0, y: "-0.52em", scale: 0.985 }}
                        transition={{
                          duration: lowPowerMode ? 0.18 : 0.26,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {" "}
                        {somethingSuffix}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </span>
            </h1>

            <span ref={vibeOrbitRef} className={styles.vibeOrbit}>
              {mounted ? (
                <AnimatePresence>
                  {vibeActive && (
                    <motion.span
                      className={styles.vibeFlow}
                      initial={{ opacity: 0, scale: 0.74 }}
                      animate={{ opacity: 1, scale: 0.8 }}
                      exit={{ opacity: 0, scale: 0.76 }}
                      transition={{ duration: 0.12 }}
                    >
                      <span className={styles.vibeShadow} aria-hidden="true" />
                      <button
                        type="button"
                        className={styles.vibeCore}
                        onClick={() => router.push(ARCHIVE_PATH)}
                      >
                        I'm feeling it
                      </button>
                      <motion.span
                        className={styles.vibeRing}
                        aria-hidden="true"
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {orbitCursors.map((cursor) => (
                          <motion.span
                            key={cursor.id}
                            className={styles.vibeCursor}
                            initial={{
                              x: 0,
                              y: 0,
                              opacity: 0,
                              scale: 0,
                            }}
                            animate={{
                              x: cursor.x,
                              y: cursor.y,
                              opacity: cursor.isTrail ? cursor.opacity : [1, 0.8, 1],
                              scale: cursor.isTrail ? cursor.scale : [1, 1.1, 1],
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0,
                              transition: { duration: 0.03 },
                            }}
                            transition={{
                              duration: 0.08,
                              delay: cursor.delay,
                              ease: "easeOut",
                              type: "spring",
                              damping: 25,
                              stiffness: 400,
                              opacity: {
                                duration: cursor.isTrail ? 0.08 : 2,
                                repeat: cursor.isTrail ? 0 : Infinity,
                                ease: "easeInOut",
                              },
                              scale: {
                                duration: cursor.isTrail ? 0.08 : 2,
                                repeat: cursor.isTrail ? 0 : Infinity,
                                ease: "easeInOut",
                              },
                            }}
                            style={
                              {
                                "--cursor-opacity": cursor.opacity,
                                "--cursor-scale": cursor.scale,
                                "--cursor-rotation": `${cursor.rotation}deg`,
                              } as CSSProperties
                            }
                          >
                            <MousePointer className={styles.vibePointer} />
                          </motion.span>
                        ))}
                      </motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              ) : null}
            </span>

            <button
              type="button"
              className={styles.vibeMobileCta}
              onClick={() => router.push(ARCHIVE_PATH)}
            >
              I'm feeling it
            </button>
          </div>

          <div className={styles.heroBuilt}>
            <p className={styles.heroBuiltLabel}>Previously he built</p>
            <ul className={styles.heroBuiltLinks}>
              {PROJECTS.map((p, i) => (
                <li
                  key={p.name}
                  className={styles.heroBuiltItem}
                  style={{ "--delay": `${i * 60 + 520}ms` } as CSSProperties}
                >
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {p.name}
                  </a>
                  {i < PROJECTS.length - 1 ? (
                    <span className={styles.heroBuiltDivider} aria-hidden="true">
                      {" "}
                      /{" "}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroWrote}>
            <p className={styles.heroWroteLead}>He also wrote</p>
            <div className={styles.heroWroteActions}>
              <Link
                href={STORY_PATH}
                className={`${styles.heroWroteLink} ${styles.cnPixel} ${isMobileViewport && storyLinkArmed ? styles.heroWroteLinkArmed : ""}`}
                onClick={(event) => {
                  if (!isMobileViewport) return;
                  if (!storyLinkArmed) {
                    event.preventDefault();
                    setStoryExcerptOpen(true);
                    setStoryLinkArmed(true);
                  }
                }}
              >
                {isMobileViewport && storyLinkArmed ? "进入《压缩》（2025）" : "压缩（2025）"}
              </Link>
              {isMobileViewport && storyLinkArmed ? (
                <button
                  type="button"
                  className={`${styles.heroWroteDismiss} ${styles.cnPixel}`}
                  onClick={() => {
                    setStoryExcerptOpen(false);
                    setStoryLinkArmed(false);
                  }}
                >
                  取消/收起
                </button>
              ) : null}
            </div>
            <p
              id="story-excerpt"
              className={`${styles.heroWroteExcerpt} ${styles.cnPixel} ${storyExcerptOpen ? styles.heroWroteExcerptOpen : ""}`}
            >
              {STORY_EXCERPT}
            </p>
          </div>
        </header>

        <footer className={styles.meta}>
          <div className={styles.metaLeft}>
            <p className={styles.label}>1.2861°N 103.8592°E</p>
            <time className={styles.localTime} dateTime={time} suppressHydrationWarning>
              {time} SGT
            </time>
            <p className={styles.status}>He might be {status}</p>
          </div>

          <div className={styles.metaRight}>
            <p className={styles.connectLine}>
              <span className={styles.connectLead}>Find Brian on </span>
              {CONNECT_LINKS.map((p, index) => (
                <span key={p.name} className={styles.connectItem}>
                  {index > 0 ? <span className={styles.connectDivider}> / </span> : null}
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {p.name}
                  </a>
                </span>
              ))}
            </p>
            <Link href={ARCHIVE_PATH} className={styles.enter}>
              Or enter his archive
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
