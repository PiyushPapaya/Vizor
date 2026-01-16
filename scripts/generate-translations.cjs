/**
 * Translation Generator Script
 * This script adds missing translation keys to all locale files
 * Run with: node scripts/generate-translations.js
 */

const fs = require('fs');
const path = require('path');

// New translation keys to add to all locales
const newTranslations = {
  "onboarding": {
    "welcome": "Welcome to Vizor!",
    "skip": "Skip Tutorial",
    "next": "Next",
    "previous": "Previous",
    "finish": "Finish",
    "getStarted": "Get Started",
    "restartTutorial": "Restart Tutorial",
    "resumeTutorial": "Resume Tutorial",
    "categories": {
      "basics": "Getting Started",
      "data": "Data",
      "customization": "Customization",
      "export": "Export"
    },
    "steps": {
      "welcome": {
        "title": "Welcome to Vizor! 🎉",
        "description": "Create stunning data visualizations in minutes. Let's take a quick tour to show you all the amazing features!"
      },
      "upload": {
        "title": "Upload Your Data",
        "description": "Start by uploading a CSV, JSON, or Excel file. You can also drag and drop files directly, paste data, or import from a URL."
      },
      "templates": {
        "title": "Quick Start Templates",
        "description": "Don't have data ready? Use our pre-built templates to get started instantly. Perfect for learning or quick demos!"
      },
      "chartType": {
        "title": "Choose Chart Type",
        "description": "Select from 14+ chart types including bar, line, pie, scatter, radar, and more. Each chart updates in real-time as you make changes."
      },
      "dataCleaning": {
        "title": "Clean Your Data",
        "description": "Remove empty rows, handle outliers, normalize values, and transform your data. Keep your visualizations accurate and professional."
      },
      "quickStats": {
        "title": "Quick Statistics",
        "description": "Get instant insights about your data including totals, averages, trends, and data health score. Identify issues before they affect your charts."
      },
      "customize": {
        "title": "Customize Everything",
        "description": "Full control over colors, fonts, labels, legends, and animations. Make every chart match your brand perfectly."
      },
      "styleOptions": {
        "title": "Style Options",
        "description": "Choose from pre-built style presets or create your own. Adjust line widths, bar radius, opacity, and more."
      },
      "chartPreview": {
        "title": "Live Preview",
        "description": "See your changes instantly in the preview panel. No waiting, no refreshing - everything updates in real-time!"
      },
      "export": {
        "title": "Export & Share",
        "description": "Download your chart as PNG, SVG, or PDF. Get embed codes for websites or share directly with a link."
      },
      "shortcuts": {
        "title": "Keyboard Shortcuts",
        "description": "Work faster with keyboard shortcuts. Press Ctrl+K for quick commands, Ctrl+S to save, and Ctrl+E to export."
      },
      "complete": {
        "title": "You're All Set! 🚀",
        "description": "You now know the basics of Vizor. Start creating beautiful charts and impress your audience. Happy visualizing!"
      }
    }
  },
  "dataCleaning": {
    "title": "Data Cleaning",
    "cleanData": "Clean Data",
    "transform": "Transform",
    "outliers": "Outliers",
    "advanced": "Advanced",
    "removeEmptyRows": "Remove Empty Rows",
    "fillMissingAverage": "Fill Missing with Average",
    "roundToIntegers": "Round to Integers",
    "normalize": "Normalize (0-100)",
    "scaleBy": "Scale by {{factor}}x",
    "zScoreThreshold": "Z-Score Threshold",
    "removeOutliers": "Remove Outliers",
    "duplicateDetection": "Duplicate Detection",
    "findDuplicates": "Find Duplicates",
    "removeDuplicates": "Remove Duplicates",
    "findReplace": "Find & Replace",
    "find": "Find",
    "replace": "Replace",
    "replaceAll": "Replace All",
    "useRegex": "Use Regex",
    "caseSensitive": "Case Sensitive",
    "sortData": "Sort Data",
    "messages": {
      "noEmptyRows": "No empty rows found",
      "removedRows": "Removed {{count}} empty rows",
      "noMissingValues": "No missing values found",
      "filledValues": "Filled {{count}} missing values with average",
      "valuesRounded": "Values rounded to {{decimals}} decimals",
      "dataNormalized": "Data normalized (0-100)",
      "dataScaled": "Data scaled by {{factor}}x",
      "noOutliers": "No outliers found",
      "removedOutliers": "Removed {{count}} outliers",
      "duplicatesFound": "Found {{count}} duplicate rows",
      "noDuplicates": "No duplicates found",
      "removedDuplicates": "Removed {{count}} duplicate rows",
      "replacedValues": "Replaced {{count}} values",
      "noMatchesFound": "No matches found",
      "dataSorted": "Data sorted successfully"
    },
    "empty": "{{count}} empty",
    "found": "{{count}} found"
  },
  "quickStats": {
    "title": "Quick Statistics",
    "total": "Total",
    "average": "Avg",
    "max": "Max",
    "min": "Min",
    "trend": "Trend",
    "dataHealth": "Data Health",
    "healthy": "healthy",
    "rows": "rows",
    "datasets": "datasets",
    "dataLooksGood": "Data looks good!",
    "issues": {
      "emptyLabels": "{{count}} empty label",
      "emptyLabelsPlural": "{{count}} empty labels",
      "zeroValues": "{{count}} zero value",
      "zeroValuesPlural": "{{count}} zero values",
      "negativeValues": "{{count}} negative value",
      "negativeValuesPlural": "{{count}} negative values",
      "outliers": "{{count}} potential outlier",
      "outliersPlural": "{{count}} potential outliers"
    }
  },
  "commandPalette": {
    "placeholder": "Type a command or search...",
    "noResults": "No results found",
    "categories": {
      "actions": "Actions",
      "navigation": "Navigation",
      "data": "Data",
      "chart": "Chart",
      "export": "Export",
      "settings": "Settings"
    },
    "commands": {
      "newProject": "New Project",
      "openProject": "Open Project",
      "saveProject": "Save Project",
      "exportChart": "Export Chart",
      "importData": "Import Data",
      "changeChartType": "Change Chart Type",
      "toggleTheme": "Toggle Theme",
      "openSettings": "Open Settings",
      "openHelp": "Open Help",
      "undoAction": "Undo",
      "redoAction": "Redo",
      "startTutorial": "Start Tutorial"
    }
  },
  "feedback": {
    "title": "Send Feedback",
    "subtitle": "Help us improve Vizor",
    "type": "Feedback Type",
    "types": {
      "bug": "Bug Report",
      "feature": "Feature Request",
      "improvement": "Improvement",
      "other": "Other"
    },
    "description": "Description",
    "descriptionPlaceholder": "Describe your feedback in detail...",
    "email": "Email (optional)",
    "emailPlaceholder": "your@email.com",
    "attachScreenshot": "Attach Screenshot",
    "submit": "Submit Feedback",
    "submitted": "Thank you for your feedback!",
    "error": "Failed to submit feedback. Please try again."
  },
  "performance": {
    "warning": "Performance Warning",
    "largeDataset": "Large dataset detected",
    "rowCount": "{{count}} rows",
    "suggestions": {
      "title": "Suggestions",
      "aggregate": "Consider aggregating your data",
      "sample": "Use a sample of your data",
      "filter": "Filter to relevant data points",
      "simplify": "Use a simpler chart type"
    },
    "continueAnyway": "Continue Anyway",
    "optimize": "Optimize Data"
  }
};

// Simple translation mappings for common languages
const translations = {
  es: {
    "onboarding.welcome": "¡Bienvenido a Vizor!",
    "onboarding.skip": "Omitir Tutorial",
    "onboarding.next": "Siguiente",
    "onboarding.previous": "Anterior",
    "onboarding.getStarted": "Comenzar",
    "onboarding.restartTutorial": "Reiniciar Tutorial",
    "onboarding.categories.basics": "Primeros Pasos",
    "onboarding.categories.data": "Datos",
    "onboarding.categories.customization": "Personalización",
    "onboarding.categories.export": "Exportar",
    "onboarding.steps.welcome.title": "¡Bienvenido a Vizor! 🎉",
    "onboarding.steps.welcome.description": "Crea impresionantes visualizaciones de datos en minutos. ¡Hagamos un recorrido rápido para mostrarte todas las funciones!",
    "onboarding.steps.upload.title": "Sube Tus Datos",
    "onboarding.steps.upload.description": "Comienza subiendo un archivo CSV, JSON o Excel. También puedes arrastrar y soltar archivos, pegar datos o importar desde una URL.",
    "dataCleaning.cleanData": "Limpiar Datos",
    "dataCleaning.transform": "Transformar",
    "dataCleaning.outliers": "Valores Atípicos",
    "dataCleaning.removeEmptyRows": "Eliminar Filas Vacías",
    "dataCleaning.fillMissingAverage": "Rellenar con Promedio",
    "dataCleaning.roundToIntegers": "Redondear a Enteros",
    "dataCleaning.normalize": "Normalizar (0-100)",
    "dataCleaning.findReplace": "Buscar y Reemplazar",
    "dataCleaning.find": "Buscar",
    "dataCleaning.replace": "Reemplazar",
    "dataCleaning.replaceAll": "Reemplazar Todo",
    "dataCleaning.sortData": "Ordenar Datos",
    "dataCleaning.duplicateDetection": "Detección de Duplicados",
    "dataCleaning.findDuplicates": "Buscar Duplicados",
    "dataCleaning.removeDuplicates": "Eliminar Duplicados",
    "quickStats.total": "Total",
    "quickStats.average": "Prom",
    "quickStats.max": "Máx",
    "quickStats.min": "Mín",
    "quickStats.trend": "Tendencia",
    "quickStats.healthy": "saludable",
    "quickStats.rows": "filas",
    "quickStats.datasets": "conjuntos",
    "quickStats.dataLooksGood": "¡Los datos se ven bien!",
    "commandPalette.placeholder": "Escribe un comando o busca...",
    "commandPalette.noResults": "No se encontraron resultados",
    "feedback.title": "Enviar Comentarios",
    "feedback.subtitle": "Ayúdanos a mejorar Vizor",
    "feedback.submit": "Enviar",
    "feedback.submitted": "¡Gracias por tus comentarios!",
    "performance.warning": "Advertencia de Rendimiento",
    "performance.largeDataset": "Gran conjunto de datos detectado",
    "performance.continueAnyway": "Continuar de Todos Modos",
    "performance.optimize": "Optimizar Datos"
  },
  de: {
    "onboarding.welcome": "Willkommen bei Vizor!",
    "onboarding.skip": "Tutorial überspringen",
    "onboarding.next": "Weiter",
    "onboarding.previous": "Zurück",
    "onboarding.getStarted": "Los geht's",
    "onboarding.restartTutorial": "Tutorial neu starten",
    "onboarding.categories.basics": "Erste Schritte",
    "onboarding.categories.data": "Daten",
    "onboarding.categories.customization": "Anpassung",
    "onboarding.categories.export": "Export",
    "onboarding.steps.welcome.title": "Willkommen bei Vizor! 🎉",
    "onboarding.steps.welcome.description": "Erstellen Sie beeindruckende Datenvisualisierungen in Minuten. Lassen Sie uns eine kurze Tour machen!",
    "dataCleaning.cleanData": "Daten bereinigen",
    "dataCleaning.transform": "Transformieren",
    "dataCleaning.outliers": "Ausreißer",
    "dataCleaning.removeEmptyRows": "Leere Zeilen entfernen",
    "dataCleaning.fillMissingAverage": "Mit Durchschnitt füllen",
    "dataCleaning.roundToIntegers": "Auf Ganzzahlen runden",
    "dataCleaning.normalize": "Normalisieren (0-100)",
    "dataCleaning.findReplace": "Suchen & Ersetzen",
    "dataCleaning.sortData": "Daten sortieren",
    "quickStats.total": "Gesamt",
    "quickStats.average": "Durchschn",
    "quickStats.max": "Max",
    "quickStats.min": "Min",
    "quickStats.trend": "Trend",
    "quickStats.healthy": "gesund",
    "quickStats.rows": "Zeilen",
    "quickStats.datasets": "Datensätze",
    "quickStats.dataLooksGood": "Daten sehen gut aus!",
    "commandPalette.placeholder": "Befehl eingeben oder suchen...",
    "feedback.title": "Feedback senden",
    "feedback.submit": "Absenden",
    "performance.warning": "Leistungswarnung",
    "performance.largeDataset": "Großer Datensatz erkannt",
    "performance.continueAnyway": "Trotzdem fortfahren",
    "performance.optimize": "Daten optimieren"
  },
  fr: {
    "onboarding.welcome": "Bienvenue sur Vizor!",
    "onboarding.skip": "Passer le tutoriel",
    "onboarding.next": "Suivant",
    "onboarding.previous": "Précédent",
    "onboarding.getStarted": "Commencer",
    "onboarding.restartTutorial": "Redémarrer le tutoriel",
    "onboarding.categories.basics": "Premiers pas",
    "onboarding.categories.data": "Données",
    "onboarding.categories.customization": "Personnalisation",
    "onboarding.categories.export": "Exporter",
    "onboarding.steps.welcome.title": "Bienvenue sur Vizor! 🎉",
    "onboarding.steps.welcome.description": "Créez de superbes visualisations de données en quelques minutes. Faisons un tour rapide!",
    "dataCleaning.cleanData": "Nettoyer les données",
    "dataCleaning.transform": "Transformer",
    "dataCleaning.outliers": "Valeurs aberrantes",
    "dataCleaning.removeEmptyRows": "Supprimer les lignes vides",
    "dataCleaning.fillMissingAverage": "Remplir avec la moyenne",
    "dataCleaning.roundToIntegers": "Arrondir aux entiers",
    "dataCleaning.normalize": "Normaliser (0-100)",
    "dataCleaning.findReplace": "Rechercher et remplacer",
    "dataCleaning.sortData": "Trier les données",
    "quickStats.total": "Total",
    "quickStats.average": "Moy",
    "quickStats.max": "Max",
    "quickStats.min": "Min",
    "quickStats.trend": "Tendance",
    "quickStats.healthy": "sain",
    "quickStats.rows": "lignes",
    "quickStats.datasets": "jeux de données",
    "quickStats.dataLooksGood": "Les données semblent bonnes!",
    "commandPalette.placeholder": "Tapez une commande ou recherchez...",
    "feedback.title": "Envoyer des commentaires",
    "feedback.submit": "Soumettre",
    "performance.warning": "Avertissement de performance",
    "performance.largeDataset": "Grand ensemble de données détecté",
    "performance.continueAnyway": "Continuer quand même",
    "performance.optimize": "Optimiser les données"
  }
};

// Deep merge function
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Set nested value
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// Main function
function updateLocales() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  
  // Get all locale files
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
  
  console.log(`Found ${files.length} locale files`);
  
  for (const file of files) {
    const langCode = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    
    console.log(`Processing ${file}...`);
    
    // Read existing translations
    let existing = {};
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
      continue;
    }
    
    // Merge new translations (English as base)
    const merged = deepMerge(existing, newTranslations);
    
    // Apply language-specific translations
    if (translations[langCode]) {
      for (const [path, value] of Object.entries(translations[langCode])) {
        setNestedValue(merged, path, value);
      }
    }
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
    console.log(`  Updated ${file}`);
  }
  
  console.log('Done!');
}

// Run if executed directly
if (require.main === module) {
  updateLocales();
}

module.exports = { updateLocales, newTranslations };
