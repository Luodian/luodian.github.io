import type { Metadata } from "next";
import Link from "next/link";
import styles from "./splash.module.css";

export const metadata: Metadata = {
  title: "Brian is building something",
  description:
    "Brian is building something. Previously he built LMMs-Eval, LLaVA-OneVision, LMMs-Engine, and OneVision-Encoder."
};

export default function HomePage() {
  return (
    <main className={styles.shell}>
      <section className={styles.canvas} aria-label="Splash intro">
        <header className={styles.hero}>
          <h1 className={styles.title}>
            Brian is building
            <span>something.</span>
          </h1>
        </header>

        <footer className={styles.meta}>
          <div className={styles.metaLeft}>
            <p className={styles.kicker}>Live Notes</p>
            <p className={styles.copy}>Building multimodal systems and open infrastructure.</p>
            <Link href="/inside" className={styles.enter}>
              Enter archive
            </Link>
          </div>

          <div className={styles.metaRight}>
            <p className={styles.kicker}>Previously he built</p>
            <ul className={styles.projectList}>
              <li>
                <a href="https://github.com/EvolvingLMMs-Lab/lmms-eval">LMMs-Eval</a>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2408.03326">LLaVA-OneVision</a>
              </li>
              <li>
                <a href="https://github.com/EvolvingLMMs-Lab/lmms-engine">LMMs-Engine</a>
              </li>
              <li>
                <a href="https://github.com/EvolvingLMMs-Lab/OneVision-Encoder">
                  OneVision-Encoder
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </section>
    </main>
  );
}
