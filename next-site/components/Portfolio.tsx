import type { ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  experience,
  projects,
  publications,
  scholar,
  updated,
  type Publication,
} from "@/lib/portfolio";
import { updates } from "@/lib/portfolio";
import styles from "./portfolio.module.css";

type View = "home" | "inside" | "publications" | "projects";
const Arrow = () => <ArrowUpRight size={15} aria-hidden="true" />;

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionLabel}>{label}</div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function ProjectList({ all = false }: { all?: boolean }) {
  return (
    <div className={styles.projects}>
      {(all ? projects : projects.slice(0, 4)).map((project, index) => (
        <article className={styles.project} key={project.id}>
          <div className={styles.projectTop}>
            <span className={styles.projectNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{project.category}</span>
            <span className={styles.projectMark} aria-hidden="true">
              {project.mark}
            </span>
          </div>
          <h3>
            <a href={project.href}>
              {project.name}
              <Arrow />
            </a>
          </h3>
          <p>{project.description}</p>
          <div className={styles.projectBottom}>
            <span>{project.note}</span>
            <div>
              <a href={project.href}>
                Project <Arrow />
              </a>
              {project.paper && (
                <a href={project.paper}>
                  Paper <Arrow />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Authors({ names }: { names: string }) {
  return (
    <>
      {names.split(", ").map((name, i) => (
        <span key={`${i}-${name}`}>
          {i > 0 && ", "}
          {name === "Bo Li" ? <strong>{name}</strong> : name}
        </span>
      ))}
    </>
  );
}

function Paper({ paper }: { paper: Publication }) {
  return (
    <article className={styles.paper} id={paper.id}>
      <div className={styles.venue}>{paper.venue}</div>
      <div>
        <h3>
          <a href={paper.href}>
            {paper.title} <Arrow />
          </a>
        </h3>
        {paper.description && <p>{paper.description}</p>}
        <details className={styles.authors}>
          <summary>Authors</summary>
          <p>
            <Authors names={paper.authors} />
          </p>
        </details>
        {paper.code && (
          <a className={styles.smallLink} href={paper.code}>
            Code <Arrow />
          </a>
        )}
      </div>
    </article>
  );
}

function SideProjects() {
  return (
    <Section id="elsewhere" label="04 / Outside the lab">
      <div className={styles.sectionHeading}>
        <h2>A few other things.</h2>
      </div>
      <div className={styles.sideProjects}>
        <a href="/compression_2025/" className={styles.story}>
          <span className={styles.eyebrow}>Fiction / 2025</span>
          <span className={styles.storyTitle} lang="zh">
            压缩<span>Compression</span>
          </span>
          <p>A story about AI consciousness and what it means to understand.</p>
          <span className={styles.smallLink}>
            Read the story <ArrowRight size={16} aria-hidden="true" />
          </span>
        </a>
        <div className={styles.smallProjects}>
          <a href="https://github.com/Luodian/nano-hevc">
            <span>
              nano-hevc <Arrow />
            </span>
            <p>A small HEVC encoder. Learning compression by building it.</p>
          </a>
          <a href="/neovim-shortcuts/">
            <span>
              Neovim Shortcuts <Arrow />
            </span>
            <p>A little reference for the editor I spend my days in.</p>
          </a>
          <a href="/play/">
            <span>
              I&apos;m feeling it <Arrow />
            </span>
            <p>The original homepage. A little less serious.</p>
          </a>
        </div>
      </div>
    </Section>
  );
}

function Services() {
  return (
    <Section id="professional-services" label="Service">
      <h2>Talks & community.</h2>
      <div className={styles.services}>
        <div>
          <h3 id="talks-and-lectures">Talks & lectures</h3>
          <ul>
            <li>
              Multimodal Models, Jump Trading (2025). Hosted by Weifeng Liu.
            </li>
            <li>
              Guest lecture, UMich EECS 542. Hosted by{" "}
              <a href="https://web.eecs.umich.edu/~stellayu/index.html">
                Stella X. Yu
              </a>
              .
            </li>
            <li>
              Multimodal Models, TwelveLabs (2024). Hosted by{" "}
              <a href="https://jameskle.com/">James Le</a>.
            </li>
            <li>
              Otter & MIMIC-IT, Alibaba Damo Academy (2023). Hosted by{" "}
              <a href="https://lidongbing.github.io/">Lidong Bing</a>.
            </li>
          </ul>
        </div>
        <div>
          <h3 id="administrative-roles">Community</h3>
          <p>
            Co-founder of{" "}
            <a href="https://blog.lmms-lab.com/about/">LMMs-Lab</a>, an open
            research community supported by Ziwei Liu.
          </p>
          <p>
            Experience as cluster administrator at{" "}
            <a href="https://www.mmlab-ntu.com/">S-Lab, NTU</a>, supporting 70+
            users and 400+ GPUs, and organizer of{" "}
            <a href="https://theaitalks.org/">The AI Talk</a>.
          </p>
          <h3 id="peer-review">Peer review</h3>
          <p>
            ICCV (2021, 2023), NeurIPS (2022), BMVC (2023), AAAI (2023), CVPR
            (2022, 2023), AISTATS (2023), ICML (2023).
          </p>
          <p>Pattern Recognition, IEEE TMM, IEEE TPAMI, and IJCV.</p>
        </div>
      </div>
    </Section>
  );
}

export default function Portfolio({ view = "home" }: { view?: View }) {
  const home = view === "home";
  return (
    <div className={styles.site}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <div className={styles.container}>
        <header className={styles.header}>
          <a
            href="/"
            className={styles.wordmark}
            aria-label="Brian Bo Li, home"
          >
            <span className={styles.monogram} aria-hidden="true">
              b.
            </span>
            Brian <span className={styles.nameDetail}>(Bo) Li</span>
          </a>
          <nav aria-label="Main navigation">
            <a
              href="/projects/"
              aria-current={view === "projects" ? "page" : undefined}
            >
              Projects
            </a>
            <a
              href="/publications/"
              aria-current={view === "publications" ? "page" : undefined}
            >
              Research
            </a>
            <a
              href="/inside/"
              aria-current={view === "inside" ? "page" : undefined}
            >
              About
            </a>
            <a href="/#elsewhere">Side notes</a>
          </nav>
        </header>
        <main id="main">
          {home ? (
            <>
              <section className={styles.hero} aria-labelledby="hero-title">
                <div className={styles.heroCopy}>
                  <div className={styles.eyebrow}>
                    <span className={styles.statusDot} />
                    Researcher & builder / Singapore
                  </div>
                  <h1 id="hero-title">
                    Brian is
                    <br />
                    building<span className={styles.period}>.</span>
                  </h1>
                  <p className={styles.heroLead}>
                    Multimodal models.
                    <br />
                    The tools to build and understand them.
                  </p>
                  <p className={styles.intro}>
                    I&apos;m Bo Li, a Member of Technical Staff at{" "}
                    <a href="https://amilabs.xyz/">
                      Advanced Machine Intelligence
                    </a>{" "}
                    and co-founder of{" "}
                    <a href="https://blog.lmms-lab.com/about/">LMMs-Lab</a>. I
                    work on multimodal intelligence, visual representations, and
                    open research tools.
                  </p>
                  <div className={styles.heroLinks}>
                    <a className={styles.primaryLink} href="#projects">
                      Explore the work{" "}
                      <ArrowRight size={17} aria-hidden="true" />
                    </a>
                    <a href="/inside/">
                      More about me <Arrow />
                    </a>
                  </div>
                </div>
                <figure className={styles.portrait}>
                  <div className={styles.photoFrame}>
                    <img
                      src="/profile-portrait.webp"
                      width="2610"
                      height="2168"
                      alt="Brian by the Merlion in Singapore before sunrise"
                      fetchPriority="high"
                    />
                    <span className={styles.photoLabel}>
                      A moment between things.
                    </span>
                  </div>
                  <figcaption>
                    <span>Singapore, 5 AM</span>
                    <span>01°17′ N / 103°51′ E</span>
                  </figcaption>
                </figure>
              </section>
              <div className={styles.socials}>
                <span>Find me on</span>
                <a href={scholar}>
                  Google Scholar <Arrow />
                </a>
                <a href="https://github.com/Luodian">
                  GitHub <Arrow />
                </a>
                <a href="https://x.com/Brian_Bo_Li">
                  Twitter <Arrow />
                </a>
                <a href="https://www.linkedin.com/in/brianbo1121/">
                  LinkedIn <Arrow />
                </a>
              </div>
              <Section id="updates" label="01 / Recent updates">
                <div className={styles.updates}>
                  {updates.map((update) => (
                    <a href={update.href} key={update.date}>
                      <time dateTime={update.date}>{update.label}</time>
                      <div>
                        <h3>{update.title}</h3>
                        <p>{update.text}</p>
                      </div>
                      <Arrow />
                    </a>
                  ))}
                </div>
              </Section>
              <Section id="projects" label="02 / Selected projects">
                <div className={styles.sectionHeading}>
                  <h2>
                    Models, and what
                    <br />
                    makes them possible.
                  </h2>
                  <a className={styles.smallLink} href="/projects/">
                    All projects <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
                <ProjectList />
              </Section>
              <Section
                id="selected-publications"
                label="03 / Selected research"
              >
                <div className={styles.sectionHeading}>
                  <h2>Recent papers.</h2>
                  <a className={styles.smallLink} href="/publications/">
                    Publication archive{" "}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
                {publications
                  .filter((p) =>
                    ["onevision-2", "encoder", "onevision-15"].includes(p.id),
                  )
                  .map((paper) => (
                    <Paper paper={paper} key={paper.id} />
                  ))}
              </Section>
              <SideProjects />
            </>
          ) : (
            <>
              <section className={styles.pageHero}>
                <div className={styles.eyebrow}>
                  Brian (Bo) Li /{" "}
                  {view === "inside"
                    ? "About"
                    : view === "projects"
                      ? "Open source"
                      : "Research"}
                </div>
                <h1>
                  {view === "inside"
                    ? "A little more context."
                    : view === "projects"
                      ? "Built in the open."
                      : "Research, over time."}
                </h1>
                <p>
                  {view === "inside"
                    ? "I build multimodal models and the systems around them."
                    : view === "projects"
                      ? "Models, training infrastructure, evaluation tools, and experiments shared with the research community."
                      : "Selected publications on multimodal intelligence, evaluation, visual representations, and generalization."}
                </p>
                <div className={styles.heroLinks}>
                  {view === "inside" ? (
                    <>
                      <a href="#professional-experience">Experience ↓</a>
                      <a href="#professional-services">Service ↓</a>
                      <a href="/publications/">
                        Publications <Arrow />
                      </a>
                    </>
                  ) : (
                    <a
                      href={
                        view === "projects"
                          ? "https://github.com/EvolvingLMMs-Lab"
                          : scholar
                      }
                    >
                      {view === "projects"
                        ? "LMMs-Lab on GitHub"
                        : "Full list on Google Scholar"}{" "}
                      <Arrow />
                    </a>
                  )}
                </div>
              </section>
              {view === "projects" ? (
                <>
                  <Section id="projects" label="Projects">
                    <ProjectList all />
                  </Section>
                  <SideProjects />
                </>
              ) : view === "publications" ? (
                <Section id="selected-publications" label="Publications">
                  <div className={styles.archiveNote}>
                    Conference and journal publications are labeled by venue.
                    Preprints are labeled arXiv.
                  </div>
                  {publications.map((paper) => (
                    <Paper paper={paper} key={paper.id} />
                  ))}
                </Section>
              ) : (
                <>
                  <Section id="introduction" label="Currently">
                    <div className={styles.about}>
                      <h2>
                        Models that see.
                        <br />
                        Tools that help us understand.
                      </h2>
                      <p>
                        I&apos;m a Member of Technical Staff at{" "}
                        <a href="https://amilabs.xyz/">
                          Advanced Machine Intelligence
                        </a>
                        . My research focuses on multimodal models and building
                        artificial intelligence systems.
                      </p>
                      <p>
                        I co-founded{" "}
                        <a href="https://blog.lmms-lab.com/about/">LMMs-Lab</a>{" "}
                        with friends, with support from{" "}
                        <a href="https://liuziwei7.github.io/">Ziwei Liu</a>. We
                        share models, data, and tools so that other researchers
                        can build on the work.
                      </p>
                      <p>
                        My work spans the LLaVA-OneVision family, codec-based
                        visual representations, multimodal evaluation, and
                        training infrastructure. Outside research, I write
                        fiction about AI consciousness and understanding.
                      </p>
                      <a className={styles.smallLink} href="/publications/">
                        Explore the research{" "}
                        <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  </Section>
                  <Section id="selected-publications" label="Selected research">
                    <div className={styles.sectionHeading}>
                      <h2>Recent papers.</h2>
                      <a className={styles.smallLink} href="/publications/">
                        Publication archive{" "}
                        <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                    {publications
                      .filter((paper) =>
                        ["onevision-2", "encoder", "onevision-15"].includes(
                          paper.id,
                        ),
                      )
                      .map((paper) => (
                        <Paper paper={paper} key={paper.id} />
                      ))}
                  </Section>
                  <Section id="professional-experience" label="Experience">
                    <h2>Along the way.</h2>
                    <div className={styles.experience}>
                      {experience.map((item) => (
                        <article key={`${item.date}-${item.name}`}>
                          <span>{item.date}</span>
                          <div>
                            <h3>
                              <a href={item.href}>
                                {item.name} <Arrow />
                              </a>
                            </h3>
                            <div className={styles.place}>{item.place}</div>
                            <p>{item.text}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </Section>
                  <Services />
                </>
              )}
            </>
          )}
        </main>
        <footer className={styles.footer}>
          <div>
            <a className={styles.footerName} href="/">
              Brian (Bo) Li
            </a>
            <span>Still learning. Still building.</span>
          </div>
          <div className={styles.footerLinks}>
            <a href={scholar}>
              Scholar <Arrow />
            </a>
            <a href="https://github.com/Luodian">
              GitHub <Arrow />
            </a>
            <a href="https://x.com/Brian_Bo_Li">
              Twitter <Arrow />
            </a>
            <span>Updated {updated}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
