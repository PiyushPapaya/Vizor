# Vizor - Professional Data Visualization Platform

<div align="center">

**Create stunning, interactive data visualizations in seconds**

[![GitHub License](https://img.shields.io/badge/License-MIT-4F46E5?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

[Features](#features) • [Quick Start](#quick-start) • [Development](#development) • [Deployment](#deployment)

</div>

---

## 🎯 What is Vizor?

Vizor is a powerful, modern data visualization platform that transforms raw data into beautiful, interactive charts. Built with React and TypeScript, it provides a seamless experience for creating professional visualizations without requiring coding knowledge.

**Perfect for:**
- 📊 Data analysts and business intelligence teams
- 🎓 Researchers and academics
- 📈 Marketing and sales professionals
- 🏢 Executives and stakeholders
- 💼 Anyone who needs to tell data stories

---

## ✨ Core Features

### 📊 Rich Chart Library
- **20+ Chart Types** - Bar, line, pie, scatter, area, heatmap, combo charts, and more
- **Customizable Styling** - Fonts, colors, gradients, and theme options
- **Responsive Design** - Charts adapt beautifully to any screen size
- **Interactive Elements** - Tooltips, legends, crosshairs, and animations

### 📁 Data Management
- **Smart File Import** - CSV, Excel, and JSON support with auto-detection
- **Data Cleaning** - Built-in tools for handling missing values and formatting
- **Data Editor** - Inline editing with validation and type safety
- **Sample Data** - Generate test data to explore features quickly
- **Data Connectors** - Connect to live data sources

### 🎨 Powerful Configuration
- **Real-Time Editing** - See changes instantly as you modify settings
- **Template Gallery** - Pre-built templates for common scenarios
- **Advanced Customization** - Control every aspect of your chart
- **Quick Stats** - Display summary statistics alongside charts
- **Custom Annotations** - Add text, arrows, and highlights to emphasize insights

### 🔧 Professional Tools
- **Project Management** - Save, organize, and manage multiple projects
- **Version History** - Track changes and revert to previous versions
- **Interactive Filters** - Add dynamic filtering with sliders and dropdowns
- **Data Table View** - Inspect raw data with sorting and filtering
- **Keyboard Shortcuts** - Speed up your workflow with hotkeys

### 📤 Export & Share
- **Multiple Formats** - Export as PNG, SVG, or JSON
- **High Resolution** - Generate print-ready visualizations
- **Local Storage** - Projects auto-save to your browser
- **Shareable Projects** - Share visualizations with team members

### 🎯 User Experience
- **Onboarding Tutorial** - Learn features step-by-step
- **Help System** - Built-in documentation and guides
- **Accessibility Settings** - Support for different visual needs
- **Dark Mode** - Easy on the eyes for extended use
- **Performance Optimized** - Smooth interactions even with large datasets

---

## 🚀 Quick Start

### Online (No Installation Required)
Visit the live application at **[getvizor.vercel.app](https://getvizor.vercel.app)** and start creating immediately.

### Run Locally

**Prerequisites:**
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

**Installation:**

```bash
# Clone the repository
git clone https://github.com/PiyushPapaya/Vizor.git
cd Vizor

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Development

### Tech Stack

**Frontend Framework:**
- React 18 - Modern UI framework
- TypeScript 5.5 - Type-safe development
- Vite - Lightning-fast build tool

**UI & Styling:**
- Tailwind CSS - Utility-first styling
- Radix UI - Unstyled, accessible components
- Framer Motion - Smooth animations
- Lucide Icons - Beautiful icon library

**Data Visualization:**
- Recharts - Composable charting library
- Chart.js - Additional chart capabilities

**State & Data Management:**
- TanStack React Query - Server state management
- Zustand (via store) - Application state
- Local Storage - Project persistence

**Infrastructure:**
- Supabase - Backend and database
- Sentry - Error tracking
- Form validation with react-hook-form

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── charts/         # Chart-related components
│   ├── landing/        # Landing page components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── store/              # Application state management
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles

public/
├── blog/               # Blog content (markdown)
└── manifest.json       # PWA manifest

supabase/
└── migrations/         # Database migrations
```

### Key Hooks

- `useKeyboardShortcuts` - Register and handle keyboard commands
- `useAutosave` - Automatically save projects
- `useDebounce` - Debounce input values
- `useUndoRedo` - Undo/redo functionality
- `useAsync` - Handle async operations
- `useMobile` - Responsive design utilities

### Key Services

- `data-parser.ts` - Parse CSV, Excel, JSON files
- `project-storage.ts` - Manage project persistence
- `export-service.ts` - Export charts in various formats
- `analytics.ts` - Track user interactions
- `templates.ts` - Pre-built chart templates
- `seo.ts` - SEO and meta tag management

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

The application is configured with `vercel.json` for optimal Vercel deployment.

### Deploy to Netlify

The application includes `netlify.toml` configuration for seamless Netlify deployment.

### Environment Variables

Create a `.env.production` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_SENTRY_DSN=your_sentry_dsn
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

- 📖 [Documentation](https://getvizor.vercel.app/docs)
- 🐛 [Report Issues](https://github.com/PiyushPapaya/Vizor/issues)
- 💬 [GitHub Discussions](https://github.com/PiyushPapaya/Vizor/discussions)

---

<div align="center">

Made with ❤️ by the Vizor community

</div>

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
