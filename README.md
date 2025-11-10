# 🌱 Serre Connectée - Interface Electron

Interface de contrôle et monitoring en temps réel pour le projet de serre connectée IoT sur Raspberry Pi.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Electron](https://img.shields.io/badge/electron-38.2.0-47848F)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Description

Application desktop Electron permettant de **contrôler et surveiller** une serre automatisée connectée à un Raspberry Pi.

**Fonctionnalités principales :**
- Monitoring temps réel (température, humidité, CO2)
- Contrôle manuel des actionneurs (LEDs, humidificateur, ventilation)
- Configuration des seuils et horaires
- Historique graphique des données (24h, 48h, 7 jours)
- Arrêt d'urgence
- Interface moderne dark mode (style high-tech/cyberpunk)

---

## Démarrage rapide

```bash
# Cloner le repository
git clone https://github.com/Ulysse-Dev-Serre/Projet_iot_interface.git
cd Projet_iot_interface

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

**Prérequis :** Node.js >= 16

---

##  Stack technique

| Technologie | Usage |
|-------------|-------|
| **Electron** | Framework desktop (Chromium + Node.js) |
| **Tailwind CSS** | Framework CSS (via CDN) |
| **Chart.js** | Graphiques interactifs |
| **JavaScript** | Logique frontend |
| **REST API** | Communication avec le Raspberry Pi |

**Architecture :**
- **Process principal** : `src/main/main.js` (Electron)
- **Renderer** : `src/renderer/` (HTML/CSS/JS)
- **Backend** : [Projet IoT Raspberry Pi](https://github.com/Ulysse-Dev-Serre/Projet_IoT_RaspberryPi)

---

##  Documentation

| Document | Description |
|----------|-------------|
| **[SETUP.md](docs/SETUP.md)** |  Guide d'installation complet |
| **[API.md](docs/API.md)** |  Documentation de l'API REST |
| **[BUILD_GUIDE.md](docs/BUILD_GUIDE.md)** |  Compiler en .exe |
| **[AGENTS.md](AGENTS.md)** |  Guide pour agents IA |

---

##  Commandes

```bash
npm start          # Lancer l'application
npm run dev        # Lancer en mode développement (DevTools)
npm run build      # Compiler pour toutes les plateformes
npm run build:win  # Compiler pour Windows (.exe)
```

---

##  Projet Backend

Cette interface communique avec le backend IoT :
**[Projet IoT Raspberry Pi](https://github.com/Ulysse-Dev-Serre/Projet_IoT_RaspberryPi)**

---

##  Captures d'écran

### Dashboard
Monitoring en temps réel et contrôle des actionneurs.

### Historique
Graphiques interactifs sur 24h, 48h ou 7 jours avec statistiques (min/max/moyenne).

---

##  Configuration

Par défaut, l'application se connecte à :
- **URL** : `http://10.0.0.216:5000`
- **API Key** : `test-key`

Modifiable via l'icône ⚙️ dans l'interface ou dans `src/renderer/config.js`.

---

## 🤝 Contribution

Contributions bienvenues ! Ouvre une issue ou une pull request.

---

##  Licence

MIT © Ulysse

---

##  Support

- **Issues** : [GitHub Issues](https://github.com/Ulysse-Dev-Serre/Projet_iot_interface/issues)
- **Backend** : [Projet IoT Backend](https://github.com/Ulysse-Dev-Serre/Projet_IoT_RaspberryPi)

---

**Développé avec ❤️ pour l'automatisation de serre connectée**
