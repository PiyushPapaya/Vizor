<div align="center">

# Vizor

### Turn a spreadsheet into a chart worth sharing — in seconds.

Drop in a CSV, pick a chart, and walk away with something that looks like a designer made it. No account, no upload to some server you don't trust, no learning curve.

[**Open Vizor →**](https://getvizor.vercel.app)  ·  [Documentation](https://getvizor.vercel.app/docs)  ·  [Report an issue](https://github.com/PiyushPapaya/Vizor/issues)

<br />

[![Live](https://img.shields.io/badge/demo-getvizor.vercel.app-000?style=flat-square)](https://getvizor.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)
[![Built with React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)

</div>

---

## Why people use it

Most charting tools ask you to sign up, sit through a tour, and then bury the one thing you came to do under ten things you didn't. Vizor does the opposite. You open the page, drop your file, and you're looking at a real chart before you've finished your coffee.

It's genuinely free, and it stays out of your way. Your data is parsed **in your browser** — nothing is shipped off to a backend to be crunched or stored. That matters when the spreadsheet is a sales forecast, a patient list, or anything you'd rather not hand to a stranger.

- **Analysts** put together a clean chart for the Monday deck without opening a BI tool.
- **Students and researchers** turn survey results into figures that hold up in a report.
- **Marketing and ops teams** track the numbers that matter without waiting on a data team.

If you have a spreadsheet, you have everything you need.

## What it does

**Bring your data in.** Drag a `.csv` or Excel (`.xlsx`) file onto the page. Vizor reads it, cleans up the obvious messes, and shows you a preview before anything is charted.

**Pick from 20 chart types.** Bar, line, area, pie, scatter, heatmap, and more — grouped by what you're trying to say (comparison, distribution, trend) so the right one is easy to find.

**Edit and watch it update.** Change a value in the built-in table and the chart moves with it. No re-import, no refresh.

**Make it yours.** Colors, labels, axes, gridlines, legends, animation. Every chart looks polished out of the box, so you only touch the settings you actually care about.

**Export clean.** Download as **PNG, SVG, or PDF**, or share a link and let someone open the live chart in their browser.

**Handle real files.** Large datasets stay smooth thanks to virtualized rendering, so a few thousand rows won't grind the page to a halt.

### And a few things you might not expect

| | |
|---|---|
| **Privacy by default** | Data is processed client-side. Nothing is uploaded unless you choose to save. |
| **Command palette** | Hit a key and jump to any action, the way you would in a code editor. |
| **Keyboard shortcuts** | Built for people who'd rather not reach for the mouse. |
| **Interactive filters** | Add sliders and dropdowns so viewers can explore the data themselves. |
| **Dark mode** | Easy on the eyes, and it looks great in a screenshot either way. |
| **Multi-language** | English and German today, with the groundwork to add more. |
| **Templates & projects** | Start from a gallery, save your work, and pick up where you left off. |
| **Accessible** | Built on Radix primitives with real keyboard and screen-reader support. |

## Try it in 30 seconds

1. Go to **[getvizor.vercel.app](https://getvizor.vercel.app)**
2. Drop in a CSV or Excel file
3. Choose a chart type
4. Tweak what you like, leave the rest
5. Export or share

That's the whole thing. No step six.

## Run it locally

```bash
git clone https://github.com/PiyushPapaya/Vizor.git
cd Vizor
npm install
npm run dev
```

Then open **http://localhost:5173**.

Useful scripts:

```bash
npm run build      # production build
npm run preview    # preview the production build locally
npm run test       # run the test suite (Vitest)
npm run lint       # lint with ESLint
```

## Under the hood

Vizor is a modern single-page app, put together with tools chosen for speed and maintainability:

- **React 18 + TypeScript** for a typed, predictable UI
- **Vite** for near-instant builds and hot reload
- **Tailwind CSS** and **Radix UI** for a consistent, accessible design system
- **Recharts** for the visualizations, **Framer Motion** for the motion
- **Zustand** for state, **TanStack Query** for data, **TanStack Virtual** for large tables
- **SheetJS (xlsx)**, **html2canvas**, and **jsPDF** for import and export
- **Supabase** for optional accounts, **Sentry** for error tracking, **Vercel** for hosting

## Contributing

Contributions are welcome, and small ones are just as valuable as big ones.

1. Fork the repo and create a branch (`git checkout -b feature/your-idea`)
2. Make your change and keep it in step with the existing style
3. Run `npm run lint` and `npm run test`
4. Commit with a clear message and open a pull request

Not sure where to start? Open an issue describing what you'd like to see, and we'll figure it out together.

## License

Released under the **MIT License**. Use it, fork it, ship it — see [`LICENSE`](LICENSE) for the details.

## On the roadmap

We're in no rush to bolt on features for their own sake, but here's where things are heading:

- Live data connections and API sources
- Team collaboration and shared workspaces
- Custom, saveable themes
- Native mobile apps for iOS and Android

Everything above works today. The rest is coming.

---

<div align="center">

Built for anyone who has data and not a lot of time.

**[Start charting →](https://getvizor.vercel.app)**

</div>
