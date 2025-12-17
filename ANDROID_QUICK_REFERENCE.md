# 📱 Android APK Build - Quick Reference Card

## One-Page Cheat Sheet

### Installation
```bash
npm install -g @capacitor/cli
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init  # App name: Vizor, Package: com.vizor.app
npx cap add android
```

### Build Process
```bash
# 1. Build web app
npm run build

# 2. Copy to Android
npx cap copy android

# 3. Build debug APK
cd android
gradlew.bat assembleDebug        # Windows
./gradlew assembleDebug           # macOS/Linux

# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Testing
```bash
# Install on device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep "Capacitor"

# List devices
adb devices
```

### Release Build
```bash
# 1. Create signing key (first time)
cd android/app
keytool -genkey -v -keystore vizor-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias vizor-key

# 2. Build release APK
cd ..
gradlew.bat assembleRelease  # Windows
./gradlew assembleRelease     # macOS/Linux

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### npm Scripts (After Setup)
```bash
npm run android:build-debug      # Build debug APK
npm run android:build-release    # Build release APK
npm run android:copy             # Copy web assets
npm run android:open             # Open Android Studio
npm run android:install          # Install APK
```

---

## Environment Setup

### Windows (PowerShell)
```powershell
# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11"

# Set ANDROID_HOME
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"

# Verify
java -version
adb --version
```

### macOS/Linux (Bash)
```bash
# Add to ~/.zshrc or ~/.bashrc
export JAVA_HOME=$(/usr/libexec/java_home -v 11)
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Verify
source ~/.zshrc
java -version
adb --version
```

---

## File Locations

| Item | Path |
|------|------|
| Web Build | `dist/` |
| Android Project | `android/` |
| Debug APK | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release APK | `android/app/build/outputs/apk/release/app-release.apk` |
| Manifest | `android/app/src/main/AndroidManifest.xml` |
| Strings | `android/app/src/main/res/values/strings.xml` |
| Keystore | `android/app/vizor-release.keystore` |
| Build Config | `android/app/build.gradle` |
| Capacitor Config | `capacitor.config.json` |

---

## Common Commands

| Task | Command |
|------|---------|
| Check devices | `adb devices` |
| Install APK | `adb install app.apk` |
| Uninstall app | `adb uninstall com.vizor.app` |
| View logs | `adb logcat` |
| Clear cache | `adb shell pm clear com.vizor.app` |
| Reboot device | `adb reboot` |
| Push file | `adb push file.txt /sdcard/` |
| Pull file | `adb pull /sdcard/file.txt .` |

---

## Build Troubleshooting

| Error | Solution |
|-------|----------|
| `JAVA_HOME not set` | Set environment variable (see above) |
| `Android SDK not found` | Install Android Studio, set ANDROID_HOME |
| `Build failed` | Run `npx cap sync android` again |
| `White screen` | Check `dist/` exists, run `npx cap copy android` |
| `APK too large` | Enable ProGuard in build.gradle |
| `APK won't install` | Run `adb uninstall com.vizor.app` first |

---

## Performance Optimization

### Reduce APK Size
```gradle
// android/app/build.gradle
buildTypes {
  release {
    minifyEnabled true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
  }
}
```

### Lazy Load Routes
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
const App = lazy(() => import('./pages/Index'));
```

### Compress Images
```bash
npm install -D imagemin imagemin-mozjpeg imagemin-pngquant
```

---

## App Icons

Create in different sizes:
- **mdpi** (48x48) → `mipmap-mdpi/ic_launcher.png`
- **hdpi** (72x72) → `mipmap-hdpi/ic_launcher.png`
- **xhdpi** (96x96) → `mipmap-xhdpi/ic_launcher.png`
- **xxhdpi** (144x144) → `mipmap-xxhdpi/ic_launcher.png`
- **xxxhdpi** (192x192) → `mipmap-xxxhdpi/ic_launcher.png`

**Quick tool:** https://romannurik.github.io/AndroidAssetStudio/

---

## Version Management

Each release needs version increment:

```gradle
// android/app/build.gradle
defaultConfig {
  versionCode 1          // Increment for each release
  versionName "1.0.0"    // User-visible version
}
```

| Release | versionCode | versionName |
|---------|------------|------------|
| Initial | 1 | 1.0.0 |
| Bugfix | 2 | 1.0.1 |
| Feature | 3 | 1.1.0 |
| Major | 4 | 2.0.0 |

---

## Time Estimates

| Task | Time |
|------|------|
| Install prerequisites | 30 min |
| Setup Capacitor | 10 min |
| First build | 15 min |
| Subsequent builds | 5 min |
| Create release build | 20 min |
| Create signing key | 5 min |
| Create Google Play account | 15 min |
| Upload and submit | 30 min |

---

## Helpful Links

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Docs:** https://developer.android.com/docs
- **Android Studio:** https://developer.android.com/studio
- **Google Play Console:** https://play.google.com/console
- **Asset Studio:** https://romannurik.github.io/AndroidAssetStudio/
- **Build Gradle:** https://gradle.org/

---

## Debugging

```bash
# Detailed logs
adb logcat | grep -i "error\|warning\|capacitor"

# Monitor specific package
adb logcat com.vizor.app:*

# Export logs to file
adb logcat > app.log

# Real-time device shell
adb shell

# Check app permissions
adb shell pm list packages | grep vizor
```

---

## Play Store Submission Checklist

- [ ] Release APK built and tested
- [ ] Version code incremented
- [ ] App icon configured (all sizes)
- [ ] App name and description set
- [ ] Screenshots captured (5+)
- [ ] Feature graphic created
- [ ] Privacy policy written
- [ ] Content rating completed
- [ ] Google Play account created
- [ ] APK uploaded to console
- [ ] All metadata filled in
- [ ] Submitted for review

---

**For detailed instructions, see:**
- **APK_BUILD_GUIDE.md** - Complete step-by-step guide
- **ANDROID_QUICKSTART.md** - Quick reference
- **setup-apk.js** - Automated setup script

**Ready to build?** Run: `node setup-apk.js`
