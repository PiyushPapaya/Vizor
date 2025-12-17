#!/usr/bin/env node

/**
 * Vizor APK Build Setup Script
 * Automates the initial setup for creating an Android APK
 * 
 * Usage: node setup-apk.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

const log = {
  success: (msg) => console.log(`\n✅ ${msg}`),
  error: (msg) => console.log(`\n❌ ${msg}`),
  info: (msg) => console.log(`\nℹ️  ${msg}`),
  step: (msg) => console.log(`\n📌 ${msg}`),
  done: (msg) => console.log(`\n🎉 ${msg}`)
};

async function checkPrerequisites() {
  log.step('Checking Prerequisites...');
  
  const checks = [
    { cmd: 'node --version', name: 'Node.js' },
    { cmd: 'npm --version', name: 'npm' },
    { cmd: 'java -version', name: 'Java' }
  ];

  let allGood = true;
  
  for (const check of checks) {
    try {
      execSync(check.cmd, { stdio: 'ignore' });
      log.success(`${check.name} installed`);
    } catch (e) {
      log.error(`${check.name} NOT found`);
      allGood = false;
    }
  }

  if (!allGood) {
    log.error('Please install missing prerequisites before continuing');
    process.exit(1);
  }

  // Check for Android SDK
  try {
    execSync('adb --version', { stdio: 'ignore' });
    log.success('Android SDK installed');
  } catch (e) {
    log.error('Android SDK NOT found. Please install Android Studio');
    log.info('Download from: https://developer.android.com/studio');
  }
}

async function installCapacitor() {
  log.step('Installing Capacitor...');
  
  try {
    execSync('npm list -g @capacitor/cli', { stdio: 'ignore' });
    log.success('Capacitor CLI already installed');
  } catch (e) {
    log.info('Installing Capacitor CLI globally...');
    execSync('npm install -g @capacitor/cli', { stdio: 'inherit' });
    log.success('Capacitor CLI installed');
  }

  log.info('Installing Capacitor packages...');
  execSync('npm install @capacitor/core @capacitor/cli @capacitor/android', { stdio: 'inherit' });
  log.success('Capacitor packages installed');
}

async function initializeCapacitor() {
  log.step('Initializing Capacitor...');

  const appName = 'Vizor';
  const appPackage = 'com.vizor.app';
  
  if (!fs.existsSync('capacitor.config.json')) {
    log.info(`Creating capacitor.config.json...`);
    
    const config = {
      appId: appPackage,
      appName: appName,
      webDir: 'dist',
      bundledWebRuntime: false,
      plugins: {
        SplashScreen: {
          launchShowDuration: 0
        }
      }
    };

    fs.writeFileSync('capacitor.config.json', JSON.stringify(config, null, 2));
    log.success('capacitor.config.json created');
  } else {
    log.success('capacitor.config.json already exists');
  }
}

async function buildWebApp() {
  log.step('Building web application...');

  if (!fs.existsSync('dist')) {
    log.info('Running: npm run build');
    execSync('npm run build', { stdio: 'inherit' });
    log.success('Web app built successfully');
  } else {
    log.success('dist folder already exists');
  }
}

async function addAndroidPlatform() {
  log.step('Adding Android platform...');

  if (!fs.existsSync('android')) {
    log.info('Running: npx cap add android');
    execSync('npx cap add android', { stdio: 'inherit' });
    log.success('Android platform added');
  } else {
    log.success('Android platform already exists');
  }
}

async function syncAndroidProject() {
  log.step('Syncing Android project...');

  log.info('Running: npx cap copy android');
  execSync('npx cap copy android', { stdio: 'inherit' });

  log.info('Running: npx cap sync android');
  execSync('npx cap sync android', { stdio: 'inherit' });

  log.success('Android project synced');
}

async function createBuildScript() {
  log.step('Creating build scripts...');

  const scripts = {
    buildWeb: `npm run build`,
    buildAndroidDebug: `npm run build && npx cap copy android && cd android && gradlew assembleDebug`,
    buildAndroidRelease: `npm run build && npx cap copy android && cd android && gradlew assembleRelease`,
    openAndroid: `npx cap open android`,
    installAPK: `adb install android/app/build/outputs/apk/debug/app-debug.apk`,
    viewLogs: `adb logcat | grep "Capacitor"`
  };

  const scriptContent = `#!/bin/bash
# Vizor APK Build Scripts

echo "Vizor Build Commands:"
echo "1. Build Web: npm run build"
echo "2. Build Debug APK: npm run build && npx cap copy android && cd android && gradlew assembleDebug"
echo "3. Build Release APK: npm run build && npx cap copy android && cd android && gradlew assembleRelease"
echo "4. Open Android Studio: npx cap open android"
echo "5. Install APK: adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo "6. View Logs: adb logcat | grep 'Capacitor'"
`;

  fs.writeFileSync('BUILD_COMMANDS.sh', scriptContent);
  log.success('BUILD_COMMANDS.sh created');

  // Also create a PowerShell version for Windows
  const psContent = `# Vizor APK Build Scripts for Windows

Write-Host "Vizor Build Commands:" -ForegroundColor Green
Write-Host "1. Build Web: npm run build"
Write-Host "2. Build Debug APK: npm run build && npx cap copy android && cd android && gradlew.bat assembleDebug"
Write-Host "3. Build Release APK: npm run build && npx cap copy android && cd android && gradlew.bat assembleRelease"
Write-Host "4. Open Android Studio: npx cap open android"
Write-Host "5. Install APK: adb install android/app/build/outputs/apk/debug/app-debug.apk"
Write-Host "6. View Logs: adb logcat | Select-String 'Capacitor'"
`;

  fs.writeFileSync('BUILD_COMMANDS.ps1', psContent);
  log.success('BUILD_COMMANDS.ps1 created (for Windows)');
}

async function createPackageJsonScripts() {
  log.step('Updating package.json with APK scripts...');

  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts['android:build-debug'] = 'npm run build && npx cap copy android && cd android && gradlew.bat assembleDebug';
  packageJson.scripts['android:build-release'] = 'npm run build && npx cap copy android && cd android && gradlew.bat assembleRelease';
  packageJson.scripts['android:open'] = 'npx cap open android';
  packageJson.scripts['android:copy'] = 'npx cap copy android && npx cap sync android';
  packageJson.scripts['android:install'] = 'adb install android/app/build/outputs/apk/debug/app-debug.apk';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log.success('package.json updated with Android scripts');
}

async function createQuickStart() {
  log.step('Creating quick start guide...');

  const guide = `# 🚀 Quick Start: Building Your First APK

## Prerequisites Check
Before building, ensure you have:
- ✅ Java Development Kit (JDK) installed
- ✅ Android SDK installed (via Android Studio)
- ✅ ANDROID_HOME environment variable set

## Quick Build (3 steps)

### 1. Build Web App
\`\`\`bash
npm run build
\`\`\`

### 2. Copy to Android
\`\`\`bash
npx cap copy android
\`\`\`

### 3. Build APK
\`\`\`bash
cd android
gradlew.bat assembleDebug  # Windows
# OR
./gradlew assembleDebug     # macOS/Linux
\`\`\`

## Find Your APK
- **Debug APK:** \`android/app/build/outputs/apk/debug/app-debug.apk\`
- **Release APK:** \`android/app/build/outputs/apk/release/app-release.apk\`

## Install on Device
\`\`\`bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
\`\`\`

## Using npm Scripts
\`\`\`bash
npm run android:build-debug    # Build debug APK
npm run android:build-release  # Build release APK
npm run android:install        # Install on connected device
npm run android:open           # Open Android Studio
npm run android:copy           # Copy web assets
\`\`\`

## Next Steps
1. Test app on Android emulator or device
2. Review APK_BUILD_GUIDE.md for detailed instructions
3. Follow DEPLOYMENT_CHECKLIST.md for Play Store submission
`;

  fs.writeFileSync('ANDROID_QUICKSTART.md', guide);
  log.success('ANDROID_QUICKSTART.md created');
}

async function runSetup() {
  console.clear();
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║         Vizor Android APK Build Setup Script                  ║');
  console.log('║                                                               ║');
  console.log('║  This script will configure your project for Android APK      ║');
  console.log('║  builds using Capacitor.                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');

  try {
    await checkPrerequisites();
    await installCapacitor();
    await initializeCapacitor();
    await buildWebApp();
    await addAndroidPlatform();
    await syncAndroidProject();
    await createBuildScript();
    await createPackageJsonScripts();
    await createQuickStart();

    log.done('Setup Complete! 🎊');
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ Next Steps:                                                     │
│ 1. Review ANDROID_QUICKSTART.md for quick build guide          │
│ 2. Review APK_BUILD_GUIDE.md for detailed instructions         │
│ 3. Run: npm run android:build-debug                            │
│ 4. Open: npx cap open android (to open Android Studio)        │
└─────────────────────────────────────────────────────────────────┘
    `);
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }

  rl.close();
}

// Run setup
runSetup();
