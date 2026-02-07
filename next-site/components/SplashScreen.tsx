"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MousePointer } from "lucide-react";
import styles from "@/app/splash.module.css";

const PROJECTS = [
  { name: "LMMs-Eval", href: "https://github.com/EvolvingLMMs-Lab/lmms-eval" },
  { name: "LLaVA-OneVision", href: "https://arxiv.org/abs/2408.03326" },
  { name: "LMMs-Engine", href: "https://github.com/EvolvingLMMs-Lab/lmms-engine" },
  {
    name: "OneVision-Encoder",
    href: "https://github.com/EvolvingLMMs-Lab/OneVision-Encoder",
  },
];

const CONNECT_LINKS = [
  { name: "Twitter", href: "https://x.com/Brian_Bo_Li" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/brianbo1121/" },
  { name: "GitHub", href: "https://github.com/luodian" },
];

const ARCHIVE_PATH = "/inside";
const STATUS_POOL = ["learning", "thinking", "coding", "sleeping"] as const;

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
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("00:00:00");
  const [status, setStatus] = useState<(typeof STATUS_POOL)[number]>("thinking");
  const [vibeActive, setVibeActive] = useState(false);
  const orbitCursors = useMemo<OrbitCursor[]>(() => {
    const cursors: OrbitCursor[] = [];
    const circles = [140, 180, 220, 260];
    const cursorsPerCircle = [8, 12, 16, 20];

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

        for (let t = 1; t <= 2; t += 1) {
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
  }, []);

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

  const placeVibe = (clientX: number, clientY: number) => {
    if (!vibeZoneRef.current || !vibeOrbitRef.current) return;
    const rect = vibeZoneRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    vibeOrbitRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <main className={styles.shell}>
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />

      <section className={styles.canvas} aria-label="Splash intro">
        <header className={styles.hero}>
          <div
            ref={vibeZoneRef}
            className={styles.titleVibeZone}
            onPointerEnter={(event) => {
              setVibeActive(true);
              placeVibe(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (!vibeActive) setVibeActive(true);
              placeVibe(event.clientX, event.clientY);
            }}
            onPointerLeave={() => setVibeActive(false)}
          >
            <h1 className={styles.title}>
              <span className={styles.titleLine}>Brian is building</span>
              <span className={styles.titleLineAccent}>Something</span>
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
                        Feeling the vibe
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
                </li>
              ))}
            </ul>
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
