# ChartForge Desktop Application Setup Guide

Complete step-by-step guide to convert ChartForge into a standalone desktop application for Windows, Mac, and Linux using Tauri.

---

## Why Desktop Application?

- ✅ **Standalone app** - No browser needed
- ✅ **Smaller file size** - ~10-15 MB (vs 100+ MB with Electron)
- ✅ **Better performance** - Native system integration
- ✅ **Offline capable** - Works without internet
- ✅ **Native file dialogs** - Better UX for file operations
- ✅ **Cross-platform** - Windows, Mac, Linux from one codebase

---

## Prerequisites

1. **Node.js** installed (you already have this)
2. **Rust** toolchain - Install from: https://rustup.rs/
   - Windows: Install Visual Studio Build Tools or VS Community
   - Mac: Xcode Command Line Tools
   - Linux: build-essential package

---

## Step 1: Copy Project Folder

Keep web and desktop versions separate to avoid conflicts.

**Windows PowerShell:**
```powershell
cd C:\Users\anil1\Downloads
Copy-Item -Path "DataViz" -Destination "DataViz-Desktop" -Recurse
cd DataViz-Desktop
```

**Why separate?**
- Web version needs landing page at `/`
- Desktop version needs app at `/`
- Different build configurations
- Easier to maintain both versions

---

## Step 2: Install Tauri Dependencies

```bash
# Install Tauri CLI
npm install --save-dev @tauri-apps/cli

# Install Tauri API for frontend
npm install @tauri-apps/api
```

---

## Step 3: Initialize Tauri

```bash
npx tauri init
```

**Answer the prompts:**
- **What is your app name?** → `ChartForge`
- **What should the window title be?** → `ChartForge - Data Visualization`
- **Where are your web assets located?** → `../dist`
- **What is the url of your dev server?** → `http://localhost:5173`
- **What is your frontend dev command?** → `npm run dev`
- **What is your frontend build command?** → `npm run build`

This creates:
- `src-tauri/` folder with Rust backend
- `src-tauri/tauri.conf.json` configuration file

---

## Step 4: Update package.json Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

---

## Step 5: Modify Routes for Desktop

**Current web version (has landing page):**
```tsx
// src/App.tsx
<Routes>
  <Route path="/" element={<Landing />} />      ← Landing page at root
  <Route path="/app" element={<Index />} />     ← App at /app
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Change to (desktop version):**
```tsx
// src/App.tsx
<Routes>
  <Route path="/" element={<Index />} />        ← App at root now!
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Also remove Landing import:**
```tsx
// Remove this line:
const Landing = lazy(() => import("./pages/Landing"));
```

---

## Step 6: Remove Back to Home Navigation

Since there's no landing page, remove the navigation from the app header.

**In `src/components/layout/AppHeader.tsx`:**

**Change this:**
```tsx
<Link to="/" className="group">
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="p-1 sm:p-1.5 rounded-lg...">
        <Zap className="h-4 w-4 text-primary-foreground" />
      </div>
    </TooltipTrigger>
    <TooltipContent>Back to Home</TooltipContent>
  </Tooltip>
</Link>
<Link to="/" className="hover:opacity-80 transition-opacity">
  <span className="font-bold...">ChartForge</span>
</Link>
```

**To this:**
```tsx
<div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-primary via-accent to-accent shadow-lg shadow-primary/20">
  <Zap className="h-4 w-4 text-primary-foreground" />
</div>
<span className="font-bold text-sm sm:text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
  ChartForge
</span>
```

Also remove the `Link` import from react-router-dom in this file.

---

## Step 7: Optional Cleanup - Remove Landing Page Files

These files are no longer needed:

```
src/pages/Landing.tsx                    ← Delete
src/components/landing/                  ← Delete entire folder
  ├── Hero.tsx
  ├── Features.tsx
  ├── Gallery.tsx
  ├── VideoShowcase.tsx
  ├── PlatformDownloads.tsx
  ├── LiveDemo.tsx
  ├── Footer.tsx
  └── StatsCounter.tsx
```

This is optional but reduces bundle size by ~50KB.

---

## Step 8: Configure Tauri Window Settings

Edit `src-tauri/tauri.conf.json`:

```json
{
  "tauri": {
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "ChartForge",
        "width": 1400,
        "height": 900,
        "minWidth": 1024,
        "minHeight": 768,
        "center": true,
        "decorations": true
      }
    ],
    "allowlist": {
      "all": false,
      "fs": {
        "all": true,
        "scope": ["$DOWNLOAD/*", "$DESKTOP/*", "$DOCUMENT/*"]
      },
      "dialog": {
        "all": true,
        "open": true,
        "save": true
      },
      "shell": {
        "all": false,
        "open": true
      }
    },
    "bundle": {
      "identifier": "com.chartforge.app",
      "active": true
    }
  }
}
```

**Key settings:**
- **fs permissions** - Allows file reading/writing
- **dialog permissions** - Native file open/save dialogs
- **Window size** - 1400x900 with 1024x768 minimum

---

## Step 9: Create App Icons

Generate icons for your app. You need:

```
src-tauri/icons/
├── 32x32.png           ← Windows taskbar
├── 128x128.png         ← Various uses
├── 128x128@2x.png      ← Retina displays
├── icon.icns           ← Mac icon
└── icon.ico            ← Windows icon
```

**Option 1: Use Tauri Icon Generator**
1. Create a 1024x1024 PNG icon
2. Visit: https://tauri.app/v1/guides/building/icon
3. Upload and download generated icons
4. Place in `src-tauri/icons/`

**Option 2: Manual Creation**
Use the ChartForge Zap logo with turquoise gradient background.

---

## Step 10: Test Development Build

```bash
npm run tauri:dev
```

**What happens:**
1. Vite dev server starts (http://localhost:5173)
2. Tauri compiles Rust backend (first time takes 5-10 minutes)
3. Desktop window opens with your app
4. Hot reload works - changes update instantly

**Verify these work:**
- ✅ App opens showing chart interface (not landing page)
- ✅ File upload works
- ✅ Chart creation works
- ✅ All features functional
- ✅ No console errors

---

## Step 11: Build Production Application

```bash
npm run tauri:build
```

**Build time:**
- First build: 10-15 minutes (compiles Rust dependencies)
- Subsequent builds: 2-3 minutes

**Output locations:**

### Windows
```
src-tauri/target/release/bundle/
├── nsis/
│   └── ChartForge_1.0.0_x64-setup.exe    ← Installer
└── msi/
    └── ChartForge_1.0.0_x64_en-US.msi    ← MSI installer
```

### Mac
```
src-tauri/target/release/bundle/
├── dmg/
│   └── ChartForge_1.0.0_x64.dmg          ← DMG installer
└── macos/
    └── ChartForge.app                     ← App bundle
```

### Linux
```
src-tauri/target/release/bundle/
├── appimage/
│   └── ChartForge_1.0.0_amd64.AppImage   ← Portable
└── deb/
    └── chartforge_1.0.0_amd64.deb        ← Debian package
```

---

## Step 12: Test Built Application

**Windows:**
```bash
cd src-tauri\target\release\bundle\nsis
.\ChartForge_1.0.0_x64-setup.exe
```

**Mac:**
```bash
open src-tauri/target/release/bundle/dmg/ChartForge_1.0.0_x64.dmg
```

**Linux:**
```bash
chmod +x src-tauri/target/release/bundle/appimage/ChartForge_1.0.0_amd64.AppImage
./ChartForge_1.0.0_amd64.AppImage
```

### Testing Checklist

- [ ] App launches successfully
- [ ] Main chart interface loads at startup
- [ ] CSV file upload works
- [ ] Excel file upload works
- [ ] JSON file upload works
- [ ] Chart types can be changed
- [ ] Chart customization works
- [ ] PNG export works
- [ ] SVG export works
- [ ] Project save works
- [ ] Project load works
- [ ] Dark/light theme toggle works
- [ ] Keyboard shortcuts work (Ctrl+S, Ctrl+N, etc.)
- [ ] App remembers window size/position
- [ ] No crashes or errors

---

## File Size Comparison

| Platform | ChartForge (Tauri) | Typical Electron App |
|----------|-------------------|----------------------|
| **Windows .exe** | ~12 MB | ~120 MB |
| **Mac .dmg** | ~10 MB | ~150 MB |
| **Linux AppImage** | ~15 MB | ~130 MB |

**Tauri is 10x smaller!** 🎉

---

## Optional Enhancements

### A. Native File Dialogs

Replace browser file picker with native dialogs for better UX.

**In `src/components/FileDropzone.tsx`:**

```tsx
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from '@tauri-apps/api/fs';

async function handleNativeFileSelect() {
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'Data Files',
      extensions: ['csv', 'xlsx', 'xls', 'json']
    }]
  });
  
  if (selected && typeof selected === 'string') {
    const contents = await readBinaryFile(selected);
    // Process file...
  }
}
```

### B. Auto-Updates

Enable automatic updates for your app.

**In `src-tauri/tauri.conf.json`:**

```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.myapp.com/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY_HERE"
    }
  }
}
```

### C. System Tray Icon

Add a system tray icon with quick actions.

**In `src-tauri/src/main.rs`:**

```rust
use tauri::SystemTray;
use tauri::SystemTrayMenu;
use tauri::CustomMenuItem;

let tray_menu = SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("show", "Show Window"))
    .add_item(CustomMenuItem::new("hide", "Hide Window"))
    .add_item(CustomMenuItem::new("quit", "Quit"));

let system_tray = SystemTray::new().with_menu(tray_menu);

tauri::Builder::default()
    .system_tray(system_tray)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
```

### D. Deep Linking

Open files by double-clicking them in file explorer.

**In `src-tauri/tauri.conf.json`:**

```json
{
  "tauri": {
    "bundle": {
      "windows": {
        "fileAssociations": [
          {
            "ext": ["chartforge"],
            "name": "ChartForge Project",
            "description": "ChartForge Project File"
          }
        ]
      }
    }
  }
}
```

---

## Distribution Guide

### Windows

**Files to distribute:**
- `ChartForge_1.0.0_x64-setup.exe` (NSIS installer - recommended)
- Or `ChartForge_1.0.0_x64_en-US.msi` (MSI installer)

**Users need:**
- Windows 10 or later
- No additional dependencies

**Optional: Code Signing**
1. Purchase code signing certificate
2. Sign with `signtool.exe`
3. Prevents "Unknown Publisher" warning

### Mac

**Files to distribute:**
- `ChartForge_1.0.0_x64.dmg` (recommended)

**Users need:**
- macOS 10.13 or later
- First time: Right-click → Open (bypass Gatekeeper)

**Required: Code Signing**
```bash
# Sign the app
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name" \
  src-tauri/target/release/bundle/macos/ChartForge.app

# Notarize (required for macOS 10.15+)
xcrun notarytool submit ChartForge.dmg \
  --apple-id "your@email.com" \
  --team-id "TEAMID" \
  --password "app-specific-password"
```

### Linux

**Files to distribute:**
- `ChartForge_1.0.0_amd64.AppImage` (most compatible)
- Or `chartforge_1.0.0_amd64.deb` (Debian/Ubuntu)

**Users need:**
- Modern Linux distribution
- Make executable: `chmod +x ChartForge.AppImage`

---

## Troubleshooting

### "Command 'tauri' not found"

**Solution:**
```bash
npm install --save-dev @tauri-apps/cli
npx tauri --version
```

### "Rust not installed" or "cargo not found"

**Solution:**
1. Install from: https://rustup.rs/
2. Restart terminal
3. Verify: `cargo --version`

### Windows Build Error: "MSVC not found"

**Solution:**
Install Visual Studio Build Tools:
1. Download from: https://visualstudio.microsoft.com/downloads/
2. Install "Desktop development with C++"
3. Restart terminal

### Mac Build Error: "xcode-select not found"

**Solution:**
```bash
xcode-select --install
```

### "Failed to bundle project"

**Solution:**
```bash
# Clean and rebuild
cd src-tauri
cargo clean
cd ..
npm run tauri:build
```

### App Won't Open on Mac: "Damaged or Incomplete"

**Solution:**
```bash
# Remove quarantine attribute
xattr -cr src-tauri/target/release/bundle/macos/ChartForge.app
```

### File Upload Doesn't Work

**Solution:**
Check `tauri.conf.json` has fs permissions:
```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "scope": ["$DOWNLOAD/*", "$DESKTOP/*", "$DOCUMENT/*"]
      }
    }
  }
}
```

---

## Performance Comparison

| Metric | ChartForge (Tauri) | Electron App |
|--------|-------------------|--------------|
| **App Size** | 12 MB | 120 MB |
| **Launch Time** | 1-2 seconds | 3-5 seconds |
| **Memory Usage** | 80-120 MB | 300-500 MB |
| **CPU Idle** | 0-1% | 2-5% |
| **Build Time** | 10 min (first), 2 min (after) | 5 min |

---

## Deployment Checklist

Before releasing your desktop app:

### Code
- [ ] All routes point to app at "/"
- [ ] Landing page removed
- [ ] No broken imports
- [ ] All features tested
- [ ] Error handling in place
- [ ] Analytics removed or configured

### Build
- [ ] Icons created (all sizes)
- [ ] tauri.conf.json configured
- [ ] Version number updated
- [ ] Bundle identifier set
- [ ] App metadata filled in

### Testing
- [ ] Tested on Windows 10
- [ ] Tested on Windows 11
- [ ] Tested on macOS (latest)
- [ ] Tested on Linux (Ubuntu)
- [ ] File operations work
- [ ] Exports work
- [ ] No console errors
- [ ] Performance acceptable

### Distribution
- [ ] Installers built for all platforms
- [ ] Code signed (Windows, Mac)
- [ ] Notarized (Mac)
- [ ] Release notes written
- [ ] Download page created
- [ ] Support documentation ready

---

## Quick Command Reference

```bash
# Development
npm run tauri:dev              # Run app in dev mode
npm run tauri info             # Show environment info

# Building
npm run tauri:build            # Build for production
npm run tauri:build -- --debug # Build with debug symbols

# Cleaning
cd src-tauri
cargo clean                    # Clean Rust build cache
cd ..
rm -rf dist                    # Clean frontend build

# Updating
cargo install tauri-cli        # Update Tauri CLI
npm update @tauri-apps/api     # Update Tauri API
```

---

## Resources

**Official Documentation:**
- Tauri Guide: https://tauri.app/v1/guides/
- API Reference: https://tauri.app/v1/api/js/
- Rust Book: https://doc.rust-lang.org/book/

**Community:**
- Discord: https://discord.com/invite/tauri
- GitHub: https://github.com/tauri-apps/tauri
- Forum: https://github.com/tauri-apps/tauri/discussions

**Tools:**
- Icon Generator: https://tauri.app/v1/guides/building/icon
- Rust Installer: https://rustup.rs/
- VS Build Tools: https://visualstudio.microsoft.com/downloads/

---

## Summary

You now have:
- ✅ Standalone desktop application
- ✅ ~10-15 MB file size (10x smaller than Electron)
- ✅ Native performance and system integration
- ✅ Cross-platform: Windows, Mac, Linux
- ✅ Offline capable with local file operations
- ✅ Professional installers for each platform

**Total setup time:** 30-60 minutes (including first Rust build)
**Result:** Production-ready desktop application 🎉

---

## Next Steps

1. **Copy the DataViz folder** → DataViz-Desktop
2. **Follow Steps 2-11** in this guide
3. **Test the built application** on your platform
4. **Share with users** or distribute via your website

**Need help?** Review the Troubleshooting section or ask for assistance with specific steps.

Good luck with your desktop app! 🚀
