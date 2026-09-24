# David Fan - Personal Portfolio

The personal portfolio website of **David Fan** (Freshman Biology Major at UMass Amherst, builder of PreBase and Coreside), hosted at [qtrick.github.io](https://qtrick.github.io).

## Architecture & Principles

- **Proof of Work First:** Focuses on actual software systems engineered: specifically [PreBase](https://github.com/Qtrick/prebasecode) (codebase mapping IDE) and [Coreside](https://github.com/Qtrick/coreside) (personal software environment with trusted declarative tools).
- **Decoupled Content Architecture:** All human-facing copy is centralized in [`src/content/siteContent.ts`](./src/content/siteContent.ts). You can rewrite any copy, bio, project detail, or tagline without touching component markup.
- **Editorial & Restrained Design:** Clean typography (Inter + JetBrains Mono), dark/light theme support, accessible semantic HTML, keyboard navigation, and interactive architecture diagrams.
- **Static GitHub Pages Deployment:** Built with React 19, TypeScript 5.7, and Vite 6. Deployed automatically via GitHub Actions.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Tests & Typecheck
```bash
npm test
npm run typecheck
```

### 4. Build for Production
```bash
npm run build
```
Production assets are generated in `dist/`.

## Editing Content

To update your bio, project details, current focus ("Now"), or contact links:
1. Open [`src/content/siteContent.ts`](./src/content/siteContent.ts).
2. Edit the desired fields.
3. Save and commit.

## GitHub Pages Deployment

The repository includes a GitHub Actions deployment workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

To enable automated deployment on GitHub:
1. In your GitHub repository settings, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose either:
   - **GitHub Actions** *(Recommended)*: Pushes to `main` run `.github/workflows/deploy.yml` which validates, builds, and deploys automatically.
   - **Deploy from a branch**: Select branch `main` and folder `/docs`. The pre-built production static files in `/docs` will be served directly.
3. Your site will be live at `https://qtrick.github.io/`.
