# Guide de Compilation - Serre Connectée

##  Compiler l'application en .exe

### Prérequis
- Node.js installé
- npm installé

### Commandes de build

#### Windows (.exe)
```bash
npm run build:win
```
Crée un installateur Windows (.exe) dans le dossier `dist/`

#### Linux (AppImage)
```bash
npm run build:linux
```

#### macOS (.dmg)
```bash
npm run build:mac
```

#### Toutes les plateformes
```bash
npm run build
```

---

##  Résultat

Après la compilation, tu trouveras dans le dossier **`dist/`** :

**Windows :**
- `Serre Connectée Setup 1.0.0.exe` - Installateur
- `Serre Connectée-1.0.0.exe` - Version portable (optionnel)

**Linux :**
- `serre-connectee-1.0.0.AppImage` - Application portable

**macOS :**
- `Serre Connectée-1.0.0.dmg` - Installateur macOS

---

##  Ajouter une icône (optionnel)

Pour avoir une belle icône d'application :

1. Crée un dossier `build/` à la racine du projet
2. Ajoute une icône :
   - **Windows** : `build/icon.ico` (256x256)
   - **macOS** : `build/icon.icns`
   - **Linux** : `build/icon.png` (512x512)

Si tu n'as pas d'icône, l'app utilisera l'icône Electron par défaut.

---

##  Configuration

La configuration est dans `package.json` sous la clé `"build"` :

- **appId** : Identifiant unique de l'app
- **productName** : Nom affiché
- **directories.output** : Dossier de sortie (dist)
- **files** : Fichiers à inclure dans le build

---

##  Conseils

### Tester avant de compiler
```bash
npm start
```

### Build de développement rapide
```bash
npm run dev
```

### Nettoyer les anciens builds
```bash
rm -rf dist/
```

### Taille du fichier
L'installateur fera environ **150-200 MB** car il inclut :
- Electron (Chromium)
- Node.js
- Ton code
- Chart.js

C'est normal pour une app Electron !

---

##  Problèmes courants

**Erreur "icon not found"**
→ Ignore ou ajoute une icône dans `build/icon.ico`

**Build très long**
→ Normal la première fois (télécharge des dépendances)

**Antivirus bloque l'exe**
→ Normal, l'exe n'est pas signé. Ajoute une exception.

---

##  Distribution

Pour distribuer ton .exe :
1. Va dans `dist/`
2. Partage `Serre Connectée Setup 1.0.0.exe`
3. Les utilisateurs l'installent comme un programme normal
4. Raccourci créé sur le bureau

---

##  Mises à jour

Pour changer la version :
1. Modifie `"version": "1.0.0"` dans `package.json`
2. Recompile avec `npm run build:win`
