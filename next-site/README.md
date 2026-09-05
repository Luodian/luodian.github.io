# Brian (Bo) Li's website

The site uses Next.js with a static export. Vercel runs the root `vercel.json` build command and publishes `next-site/out`.

## Develop and verify

```sh
cd next-site
npm ci
npm run sync:all
npm run dev
```

```sh
npm run build
node scripts/check-export.mjs
```

The export check verifies portfolio routes, internal links and anchors, metadata, and the updated publications. Preview the production export with `python3 -m http.server 4173 --directory out`.

## Edit content

- `lib/portfolio.ts` contains current projects, recent papers, updates, and experience.
- `lib/publication-history.json` contains earlier publication records migrated from the previous homepage.
- `components/Portfolio.tsx` and `components/portfolio.module.css` render the homepage, projects, publications, and about pages.
- `/play/` preserves the original interactive homepage.
- `CONTENT_SOURCES.md` records the sources used for the September 2026 update.

Keep venue labels precise, distinguish preprints from conference and journal publications, and use the linked source for release dates. Update the shared review date only after checking the content. Do not put changing citation or star counts in prose.

## Legacy pages and assets

The build copies legacy HTML from `docs/` into `next-site/legacy/` and assets from `docs/assets/` into `next-site/public/assets/`. Edit the source under `docs/`, since the copied output is overwritten during every build. Native routes own `/`, `/inside/`, `/projects/`, `/publications/`, and `/play/`; nested legacy routes such as `/projects/genbench/` remain available.

The homepage uses `public/profile-portrait.webp`, a smaller rendition of the existing profile photograph. Files directly under `public/` are preserved by asset synchronization.
