# VedAarna Studio

A replica of [Bunai](https://www.bunai.com/) — handcrafted Indian fashion store built with TanStack Start, React, TypeScript, and Tailwind CSS.

## 🚀 Live Site

Deployed on **Cloudflare Pages** via GitHub Actions on every push to `main`.

## 💻 Run Locally

You need **Node.js ≥ 18** or **Bun**.

```sh
# Clone the repo
git clone https://github.com/manishsinghsfdeveloper/vedaarna-studio.git
cd vedaarna-studio

# Install dependencies (pick one)
bun install       # recommended — uses bun.lock
npm install       # alternative

# Start dev server
bun run dev
npm run dev
```

Open **http://localhost:5173**

## 📦 Build

```sh
bun run build
# Output goes to .output/
```

## ☁️ Deploy to Cloudflare Pages (one-time setup)

1. **Create a Cloudflare account** → https://dash.cloudflare.com/sign-up
2. **Create a Pages project** named `vedaarna-studio`  
   → Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. **Get your API token** → Cloudflare Dashboard → My Profile → API Tokens → Create Token → use "Edit Cloudflare Workers" template
4. **Get your Account ID** → Cloudflare Dashboard → right sidebar on any page
5. **Add GitHub Secrets** → GitHub repo → Settings → Secrets and variables → Actions → New secret:
   - `CLOUDFLARE_API_TOKEN` — your API token from step 3
   - `CLOUDFLARE_ACCOUNT_ID` — your account ID from step 4
6. Push any commit to `main` — GitHub Actions will auto-deploy ✅

## 🏗️ Built With

- [TanStack Start](https://tanstack.com/start) — SSR React framework
- [TypeScript](https://www.typescriptlang.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) — accessible components
- [Cloudflare Pages](https://pages.cloudflare.com/) — hosting
