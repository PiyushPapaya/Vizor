# Vizor

Vizor turns your data into charts. Upload a CSV, pick a chart type, customize it, and export. That's it.

## What You Can Do

Import your data as CSV, JSON, or Excel. Create bar charts, line charts, pie charts, scatter plots, and about 15 other types. Filter the data. Add annotations. Save multiple versions. Export as PNG, SVG, or keep the raw JSON.

You also get keyboard shortcuts, undo/redo, and projects that save automatically to your browser. If you need templates, they're there. If you want to edit data inline, you can do that too.

## Getting Started

Go to [getvizor.vercel.app](https://getvizor.vercel.app) and start using it right now. No signup. No installation.

Or run it locally:

```bash
git clone https://github.com/PiyushPapaya/Vizor.git
cd Vizor
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## What You Need

Node.js 18 or higher. That's it for local development.

## How to Build

```bash
npm run build
```

Your production files go in `dist/`.

## How to Deploy

Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Or use Netlify. The config files are already here.

Set these environment variables wherever you deploy:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SENTRY_DSN
```

## How the Code is Organized

```
src/
  components/    Charts, data panels, dialogs
  pages/         Landing, app, docs, blog
  hooks/         Custom hooks for common tasks
  lib/           File parsing, storage, exports
  store/         State management
  types/         TypeScript types
```

## How to Help

Fork this repo. Make your changes. Send a pull request. We merge it if it works.

## What's Running This

React 18, TypeScript, Vite for building, Tailwind for styling, Recharts for charts, Radix UI for components, Supabase for the backend.

## Questions

Read the [docs](https://getvizor.vercel.app/docs) or [open an issue](https://github.com/PiyushPapaya/Vizor/issues).

## License

MIT

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Guidelines:**
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- UI components by [Radix UI](https://radix-ui.com)

---

## 📞 Support

Need help? We're here for you:

- 📧 Email: support@vizor.app
- 🐦 Twitter: [@getvizor](https://twitter.com/getvizor)
- 💬 GitHub Issues: [Report a bug](https://github.com/yourusername/vizor/issues)

---

## 🗺️ Roadmap

- [x] 20+ chart types
- [x] Real-time editing
- [x] Export to PNG/SVG/PDF
- [x] Interactive filters
- [ ] API integration for live data
- [ ] Collaboration features
- [ ] Custom themes builder
- [ ] Mobile apps (iOS/Android)
- [ ] AI-powered chart suggestions

---

<div align="center">

**Made with ❤️ for data enthusiasts everywhere**

[Website](https://getvizor.vercel.app) • [Twitter](https://twitter.com/getvizor) • [Blog](https://getvizor.vercel.app/blog)

</div>

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ab98c4eb-66cc-4753-b46c-f3a6c27d8ca8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
