# next-site

Next.js template for migrating the current Jekyll output with parity-first behavior.

## What this version guarantees

- Route-level parity with the current site pages:
  - `/`
  - plus every non-root HTML route discovered from legacy pages automatically
- Existing HTML/CSS structure is preserved by rendering from legacy HTML files.
- Existing static assets are reused from `docs/assets` and `docs/projects/genbench`.

## Usage

1. Sync legacy pages and assets:

```bash
npm run sync:all
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Build static export:

```bash
npm run build
```

`npm run build` will auto-sync legacy pages and assets before building.
Generated output goes to `next-site/out`.
