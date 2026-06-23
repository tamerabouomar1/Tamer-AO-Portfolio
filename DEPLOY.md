# Deploying the portfolio (live + editable)

This is a Vite + React app. To keep it **live and editable**, host it on a service
that auto-rebuilds when you push code changes. Recommended: **GitHub + Netlify** (free).

## One-time setup

### 1. Put the code on GitHub
1. Make a free account at https://github.com
2. Create a new **empty** repository (no README) — e.g. `tamer-portfolio`.
3. In a terminal, from this folder (`portfolio-app`), run the commands GitHub shows you,
   which look like:
   ```bash
   git remote add origin https://github.com/<your-username>/tamer-portfolio.git
   git branch -M main
   git push -u origin main
   ```
   (The repo is already initialised and committed locally.)

### 2. Connect Netlify
1. Make a free account at https://netlify.com (sign in with GitHub).
2. **Add new site → Import an existing project → GitHub →** pick `tamer-portfolio`.
3. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. ~1 minute later you get a live URL like
   `https://tamer-portfolio.netlify.app`.

## Editing after it's live (this is the "keep it editable" part)
Every time you change the code and push, Netlify rebuilds and the live site updates
automatically (~1 min). Workflow:
```bash
# make edits (e.g. in src/siteData.js), then:
git add -A
git commit -m "update content"
git push
```
- Most **content** (projects, descriptions, contact links, schedule) lives in
  **`src/siteData.js`** — easy to edit without touching the design.
- You can edit locally in an editor (VS Code), or directly on github.com (pencil icon).

## Custom domain (optional)
In Netlify → Domain settings → add a domain (e.g. `tamerao.com`). Buy it from any
registrar (Namecheap/Google Domains) and point it to Netlify per their instructions.

## Alternatives
- **Vercel** (vercel.com) works the same way — import the GitHub repo, it auto-detects Vite.
- **Quick test, no GitHub:** run `npm run build`, then drag the `dist` folder onto
  https://app.netlify.com/drop. Downside: you must re-drag to update (not auto-editable).
