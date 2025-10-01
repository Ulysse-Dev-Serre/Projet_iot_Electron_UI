# Guide d'installation - Serre Connectée

Guide complet pour installer et démarrer l'interface Electron de contrôle de la serre.

---

## 📋 Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** (version 16 ou supérieure)
  - Télécharger : https://nodejs.org/
  - Vérifier : `node --version`

- **npm** (inclus avec Node.js)
  - Vérifier : `npm --version`

- **Git** (pour cloner le projet)
  - Télécharger : https://git-scm.com/
  - Vérifier : `git --version`

---

## 🚀 Installation depuis GitHub

### 1. Cloner le repository

```bash
git clone https://github.com/Ulysse-Dev-Serre/Projet_iot_interface.git
cd Projet_iot_interface
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande installe :
- Electron (framework)
- electron-builder (pour compiler)
- Chart.js (pour les graphiques)

⏱️ **Temps d'installation :** 2-3 minutes

---

## ⚙️ Configuration

### Connexion au Raspberry Pi

L'application est préconfigurée pour se connecter à :
- **URL** : `http://10.0.0.216:5000`
- **API Key** : `test-key`

**Pour modifier la configuration :**

1. **Via l'interface** (recommandé) :
   - Lance l'app avec `npm start`
   - Clique sur l'icône ⚙️ dans le header
   - Modifie l'URL et la clé API
   - Clique sur "Connecter"

2. **Via le fichier** :
   - Ouvre `src/renderer/config.js`
   - Modifie :
     ```javascript
     const CONFIG = {
       API_KEY: 'ta-cle-api',
       BASE_URL: 'http://ton-ip:5000',
       POLL_INTERVAL: 10000
     };
     ```

---

## 🎯 Démarrage

### Mode développement (avec DevTools)

```bash
npm run dev
```

Lance l'application avec la console développeur ouverte.

### Mode normal

```bash
npm start
```

Lance l'application en mode utilisateur.

---

## 🛠️ Vérifier la connexion

### 1. Tester le Raspberry Pi

Avant de lancer l'app, vérifie que le Raspberry Pi est accessible :

```bash
# Depuis Windows
curl http://10.0.0.216:5000/health

# Ou ouvre dans un navigateur
http://10.0.0.216:5000/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "version": "3.0.0",
  "mode": "full-control",
  "orchestrator": "attached"
}
```

### 2. Tester les données

```bash
curl http://10.0.0.216:5000/api/status
```

**Réponse attendue :**
```json
{
  "timestamp": "2025-10-01 12:00:00",
  "temperature": "25.8",
  "humidite": "32.4",
  "co2": "650",
  "sensor_read_ok": true,
  "leds": { ... },
  "humidifier": { ... },
  "ventilation": { ... }
}
```

---

## 📁 Structure du projet

```
Projet_iot_interface/
├── src/
│   ├── main/
│   │   ├── main.js           # Process principal Electron
│   │   └── preload.js        # Bridge sécurisé
│   └── renderer/
│       ├── index.html        # Interface utilisateur
│       ├── app.js            # Logique frontend
│       └── config.js         # Configuration
├── docs/                     # Documentation
│   ├── SETUP.md             # Ce fichier
│   ├── API.md               # Documentation API
│   └── BUILD_GUIDE.md       # Guide de compilation
├── node_modules/            # Dépendances (généré)
├── dist/                    # Builds compilés (généré)
├── package.json             # Métadonnées du projet
├── AGENTS.md               # Guide pour les agents IA
└── README.md               # Guide principal
```

---

## 🔧 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm install` | Installe les dépendances |
| `npm start` | Lance l'app en mode normal |
| `npm run dev` | Lance l'app en mode développement |
| `npm run build` | Compile l'app pour toutes les plateformes |
| `npm run build:win` | Compile pour Windows (.exe) |
| `npm run build:linux` | Compile pour Linux (AppImage) |
| `npm run build:mac` | Compile pour macOS (.dmg) |

---

## 🐛 Résolution des problèmes

### L'application ne se connecte pas

**Problème :** "Offline" dans le header

**Solutions :**
1. Vérifie que le Raspberry Pi est allumé et sur le réseau
2. Vérifie l'IP : `ping 10.0.0.216`
3. Vérifie que l'API tourne sur le Pi : `curl http://10.0.0.216:5000/health`
4. Modifie l'URL dans les paramètres (icône ⚙️)

### Erreur "API Key invalide"

**Problème :** Les contrôles ne fonctionnent pas (lecture OK mais pas de contrôle)

**Solutions :**
1. Vérifie la clé API dans les paramètres (icône ⚙️)
2. Sur le Raspberry Pi, vérifie : `echo $API_KEY`
3. Relance l'API sur le Pi avec : `export API_KEY="test-key" && python main.py`

### Les graphiques ne s'affichent pas

**Problème :** Onglet Historique vide

**Solutions :**
1. Attends quelques heures que des données s'accumulent
2. Vérifie l'historique : `curl http://10.0.0.216:5000/api/history?limit=10`
3. Si vide, laisse la serre tourner plus longtemps

### npm install échoue

**Problème :** Erreur pendant l'installation

**Solutions :**
1. Supprime `node_modules/` et `package-lock.json`
2. Relance : `npm install`
3. Si ça persiste, vérifie ta version de Node : `node --version` (doit être >= 16)

### L'app ne démarre pas

**Problème :** Erreur au lancement

**Solutions :**
1. Vérifie que toutes les dépendances sont installées : `npm install`
2. Essaie en mode dev pour voir les erreurs : `npm run dev`
3. Regarde la console pour les messages d'erreur

---

## 🔄 Mises à jour

### Mettre à jour le code

```bash
git pull origin main
npm install
npm start
```

### Mettre à jour les dépendances

```bash
npm update
```

---

## 📊 Fonctionnalités

### Onglet Dashboard
- ✅ Affichage temps réel (température, humidité, CO2)
- ✅ Contrôle manuel des actionneurs (LEDs, humidificateur, ventilation)
- ✅ Mode automatique individuel ou global
- ✅ Arrêt d'urgence
- ✅ Configuration des seuils

### Onglet Historique
- ✅ Graphiques sur 24h, 48h ou 7 jours
- ✅ Statistiques (moyenne, min, max)
- ✅ Données groupées par heure/4h/12h

---

## 📞 Support

**Problème avec le backend (Raspberry Pi) :**
- Voir la documentation du projet backend

**Problème avec le frontend (cette app) :**
- Ouvre un issue sur GitHub
- Consulte `AGENTS.md` pour les détails techniques

---

## 🎨 Personnalisation

### Changer l'intervalle de polling

Édite `src/renderer/config.js` :
```javascript
POLL_INTERVAL: 10000  // 10 secondes (10000 ms)
```

### Changer le thème

Les couleurs sont dans `src/renderer/index.html` :
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        dark: { ... },
        neon: { ... }
      }
    }
  }
}
```

---

## 📝 Notes importantes

- L'application communique avec le Raspberry Pi via HTTP (pas HTTPS)
- Les données sont rafraîchies toutes les 10 secondes
- L'historique nécessite que le backend enregistre les données
- La clé API est stockée en localStorage (navigateur Electron)
- Pas de données sauvegardées localement (tout vient du Pi)

---

## ✅ Checklist de démarrage

- [ ] Node.js installé (>= v16)
- [ ] Git installé
- [ ] Projet cloné
- [ ] `npm install` exécuté avec succès
- [ ] Raspberry Pi accessible (ping OK)
- [ ] API du Pi répond (`/health` OK)
- [ ] Application lancée (`npm start`)
- [ ] Connexion établie (status "Online")
- [ ] Données affichées (température, etc.)
- [ ] Contrôles testés (allumer/éteindre un appareil)

---

**Bon développement ! 🚀**
